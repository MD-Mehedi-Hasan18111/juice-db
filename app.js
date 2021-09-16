let orderedJuice = [];
const searchBtn = document.getElementById('search-btn');
searchBtn.addEventListener('click', () => {
    document.getElementById('error').innerHTML = '';
    document.getElementById('items').innerHTML = '';

    const inputText = document.getElementById('input').value;
    if (inputText.length > 0) {
        document.getElementById('spinner').classList.remove('d-none');
        getData(inputText);
    }
    else {
        errorMessage("bg-danger", "No Input!");
    }
    document.getElementById('input').value = '';
})

const getData = (inputText) => {
    if (inputText.value === 1) {
        juiceCards(`https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${inputText}`);
    }
    else {
        juiceCards(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputText}`);
    }
}

// fetch data function.
const fetchData = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// data received from fetchData function and showing by cards.
const juiceCards = (url) => {
    fetchData(url).then(data => {
        document.getElementById('spinner').classList.add('d-none');
        const parentDiv = document.getElementById('items');
        const { idDrink, strDrink, strDrinkThumb, strCategory, strGlass, dateModified } = data.drinks;

        data.drinks.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
            <div class="card h-100 p-3" style="width: 20rem;">
                <img height="200px" width="200px" src="${item.strDrinkThumb}" class="card-img-top" alt="...">
                <div class="card-body text-center">
                    <h3 class="text-danger">${item.strDrink}</h3>
                    <h5>Category: <span class="orange">${item.strCategory}</span></p>
                    <h5>Glass: <span class="orange">${item.strGlass}</span></p>                                  
                </div>
                <div class="card-footer">
                    <div class="d-block">
                        <button onclick="addToCart(${item.idDrink})" class="btn btn-danger w-100"><i class="fas fa-cart-plus"></i>&nbsp;Add to Cart</button>
                    </div>
                </div>
          </div>
            `
            parentDiv.appendChild(div);
        })
    }).catch(err => {
        errorMessage("bg-warning", "Sorry, Your search recipe not available!");
    })
}

// cart add function.
const addToCart = (id) => {
    const existJuice = orderedJuice.find(item => item.idDrink == id);

    if (existJuice !== undefined) {
        existJuice.quantity++;
        updateCart();
    }
    else {
        fetchData(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`).then(data => {
            console.log(data);
            const { strDrink, strDrinkThumb, idDrink } = data.drinks[0];
            orderedJuice = [...orderedJuice, { strDrink, strDrinkThumb, idDrink, quantity: 1 }];
            updateCart();
        })
    }
}

// cart update function.
const updateCart = () => {
    document.getElementById('count').innerText = orderedJuice.length;
    const body = document.getElementById('carts');
    const footer = document.getElementById('footer');
    body.innerHTML = '';
    orderedJuice.map(item => {
        const { strDrinkThumb, strDrink, quantity } = item;
        const row = document.createElement('div');
        row.classList.add('row');
        row.classList.add('my-3');
        row.classList.add('cartsRowstyle');
        row.innerHTML = `
            <div class="col-lg-6 col-md-12 col-sm-12">
                <img style="border-radius:50%;" height="150px" width="150px" src="${strDrinkThumb}" />
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12">
                <h3>${strDrink}</h3>
                <p>Quantity: ${quantity}</p>
            </div>
        `
        body.appendChild(row);
    })

    footer.innerHTML = `
        <button onclick="clearCarts()" type="button" class="btn btn-success" data-bs-dismiss="modal">Confirm Order</button>
    `
}

// clear carts function.
const clearCarts = () => {
    document.getElementById('items').innerHTML = '';
    document.getElementById('carts').innerHTML = '';
    orderedJuice = 0;
    document.getElementById('count').innerText = 0;
    errorMessage("bg-success", "Congratulations! Your Order has been successful. Thank You!");
}

// error message function
const errorMessage = (bgColor, message) => {
    document.getElementById('error').innerHTML = `
        <div id="error">
            <div class="${bgColor} mx-auto container p-4 w-50 text-center text-light border-1 rounded mt-5">
                <h4>${message}</h4>
            </div>
        </div>
        `
}