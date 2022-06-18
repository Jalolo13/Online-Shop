const burger = document.querySelector(".burger");
const burgerMenu = document.querySelector(".burger-menu");
const basket = document.querySelector(".vector-basket");
const products = document.querySelector(".products");
const basketMenu = document.querySelector(".basket-menu");
const productsCount = document.querySelector(".products-count");
const ul = document.querySelector(".products-to-basket");
const total = document.querySelector(".receipe-total");
const empty = document.querySelector(".product-empty");
let price = 0;
let cart = [];
let amount = 0;

burger.addEventListener("click", function () {
    burgerMenu.classList.add("active");
    burgerMenu.classList.remove("close");
    document.body.classList.toggle("_lock");
});

document.querySelector(".burger-close").addEventListener("click", () => {
    document.body.classList.toggle("_lock");
    burgerMenu.classList.remove("active");
    burgerMenu.classList.add("close");
});

basket.addEventListener("click", function () {
    basketMenu.classList.add("active");
    basketMenu.classList.remove("close");
});

document.querySelector(".basket-close").addEventListener("click", () => {
    basketMenu.classList.remove("active");
    basketMenu.classList.add("close");
});

async function getResponse() {
    let response = await fetch("http://localhost:1717/pastry");
    return response.json();
}

async function getData() {
    let data = await getResponse();
    if (data) {
        data.forEach((item) => {
            createTemplate(item);
        });
    }
    return data;
}

async function getResponseId(id) {
    let response = await fetch(`http://localhost:1717/pastry/detail/${id}`);
    return response.json();
}

// Чтобы кнопка была активной или нет
function btn(id, inStock) {
    if (inStock == 0) {
        return `<button class="product-addbasket-not">Not avaliable</button>`;
    } else {
        return `<button data-id=${id} class="product-addbasket">Add to cart</button>`;
    }
}

// Функция создания ингридиентов во Wrapper
function createTemplate(data) {
    let ingredients = [];
    if (data.ingredients.length) {
        ingredients = data.ingredients.reduce((acc, item) => {
            return acc + ", " + item;
        });
    } else {
        ingredients = "unknown";
    }
    let div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML += `
            <img src="${data.image}" class="product-img" alt="recipe-img" />
            <div class="product-inner">
            <h2 class="product-title">${data.name}</h2>
            <p class="product-ingridients">${ingredients}</p>
            <p class="product-cost">${data.cost} $</p>
        </div>
        ${btn(data.id, data.inStock)}`;
    div.dataset.id = data.id;
    products.append(div);
}

async function addToCart(id) {
    let data = await getResponseId(id);
    console.log(data);
    if (cart.some((item) => item.id === id)) {
        changeItems("plus", id);
    } else {
        if (data.id === id) {
            cart.push({ ...data, items: 1 });
        }
        console.log(cart);
    }

    updateCart();
}

const updateCart = () => {
    renderCartItems();
    renderTotal();
    printQuantity();
};

const printQuantity = () => {
    let totalItems = 0;
    cart.forEach((item) => (totalItems += item.items));
    productsCount.innerHTML = totalItems;
};

const renderTotal = () => {
    let totalPrice = 0;

    cart.forEach((item) => {
        totalPrice += item.items * item.cost;
    });

    total.innerHTML = `
        <hr class="total-line">
        Total: <p class="total-price">${totalPrice.toFixed(2)} $</p> `;
};

const renderCartItems = () => {
    ul.innerHTML = "";
    cart.forEach((item) => {
        ul.innerHTML += `
        <li class="product-basket" data-id="${item.id}">
            <p class="receipe-name">${item.name}</p>
            <p class="receipe-cost" data-price="${item.cost}">
                ${item.cost} $
            </p>
            <div class="receipe-items">
                <button class="receipe-minus" data-id="${item.id}">-</button>
                <p class="receipe-amount">${item.items} items</p>
                <button class="receipe-plus" data-id="${item.id}">+</button>
            </div>
                <button class="receipe-max" data-id="${item.id}">max</button>
                <button class="delete-from-basket" data-id="${item.id}">REMOVE</button>
            
        </li>
        `;
    });
};

const changeItems = (action, id) => {
    cart = cart.map((item) => {
        let items = item.items;

        if (item.id === id) {
            if (action === "minus" && items > 1) {
                items--;
            } else if (action === "plus" && items < item.inStock) {
                items++;
            } else if (action === "max" && items < item.inStock) {
                items = item.inStock;
            }
        }
        return {
            ...item,
            items,
        };
    });
    updateCart();
};

document.addEventListener("click", (e) => {
    if (e.target.closest(".product-addbasket")) {
        empty.style.display = "none";
        total.style.display = "block";
        let id = e.target.dataset.id;
        addToCart(id);
    }
});

// Функция удаления эл-ов
const removeFromCart = (id) => {
    cart = cart.filter((item) => item.id !== id);
    updateCart();
    console.log(cart);
    if (cart.length == 0) {
        empty.style.display = "block";
        total.style.display = "none";
    }
};

document.addEventListener("click", (e) => {
    let id = e.target.dataset.id;
    if (e.target.closest(".receipe-minus")) {
        changeItems("minus", id);
    } else if (e.target.closest(".receipe-plus")) {
        changeItems("plus", id);
    } else if (e.target.closest(".receipe-max")) {
        changeItems("max", id);
    }
});

document.addEventListener("click", (e) => {
    if (e.target.closest(".delete-from-basket")) {
        let id = e.target.dataset.id;
        removeFromCart(id);
    }
});

getData();
