let inStock = [];
let adminProducts = document.querySelector(".admin-products");
const burger = document.querySelector(".burger");
const burgerMenu = document.querySelector(".burger-menu");

async function getResponse() {
    let response = await fetch("http://localhost:1717/pastry");
    return response.json();
}

async function getResponseId(id) {
    let response = await fetch(`http://localhost:1717/pastry/detail/${id}`);
    return response.json();
}

async function getData() {
    let data = await getResponse();
    if (data) {
        data.forEach((item) => {
            createEdit(item);
        });
    }
    return data;
}

async function getDataId(id) {
    let data = await getResponseId(id);
    return data;
}

async function postData(data) {
    let response = await fetch("http://localhost:1717/pastry/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let dataResponse = await response.json();
    return dataResponse;
}

async function deleteData(id) {
    let response = await fetch(`http://localhost:1717/pastry/delete/${id}`, {
        method: "DELETE",
    });
    let deleted = response.json();
    return deleted;
}

async function updateData(id, data) {
    let response = await fetch(`http://localhost:1717/pastry/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    let updateData = await response.json();
    return updateData;
}

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

const createEdit = (data) => {
    let div = document.createElement("div");
    div.dataset.id = data.id;
    div.classList.add("admin-block");
    div.innerHTML = `
        <div class="admin-block-name flex">
            <input disabled autofocus type="text" value="${data.name}" class="admin-block-name-title">
            <button class="admin-edit-btn"></button>
        </div>
        <div class="admin-block-price flex">
            <p class="admin-text">price:</p>
            <input disabled class="admin-price" value="${data.cost}">
            <button class="admin-edit-btn-price"></button>
        </div><p class="admin-text">in stock:</p>
        <div class="admin-block-instock flex">
            <button class="stockbtn minus-btn" data-minus="minus"></button>
            <p class="admin-instock">${data.inStock}</p>
            <button class="stockbtn plus-btn" data-plus="plus"></button>
        </div>
        <button class="admin-delete-btn"></button>
    `;
    adminProducts.append(div);
};

const update = () => {
    document.addEventListener("click", (e) => {
        let target = e.target;
        let targetId = target.closest(".admin-block").dataset.id;
        if (target.closest(".admin-block") && target.tagName === "BUTTON") {
            let edit = target.previousElementSibling;

            // Изменение и обновление текста

            if (target.classList.contains("admin-edit-btn")) {
                if (!target.classList.contains("done")) {
                    target.classList.add("done");
                    edit.removeAttribute("disabled");
                } else {
                    edit.setAttribute("disabled", "");
                    edit.focus();

                    updateData(targetId, {
                        name: edit.value,
                    });
                    target.classList.remove("done");
                }
            }

            // Изменение Обновление цены
            else if (target.classList.contains("admin-edit-btn-price")) {
                if (!target.classList.contains("done")) {
                    target.classList.add("done");

                    edit.removeAttribute("disabled");
                } else {
                    edit.setAttribute("disabled", "");
                    edit.focus();

                    updateData(targetId, {
                        cost: parseFloat(edit.value),
                    });
                    target.classList.remove("done");
                }
            }

            // Изменение кол-ва товаров
            else if (target.classList.contains("stockbtn")) {
                let stockBlock = target.closest(".admin-block-instock"); // Блок с кол-вом
                let stockBtn = stockBlock.querySelector(".admin-instock"); // Текстовое обозначение кол-ва
                let stockBtnInt = parseInt(stockBtn.textContent); // Численное обозначение кол-ва

                if (target.className.includes("plus")) {
                    stockBtn.textContent = stockBtnInt += 1;

                    updateData(target.closest(".admin-block").dataset.id, {
                        inStock: stockBtnInt,
                    });
                } else if (target.className.includes("minus")) {
                    if (stockBtnInt === 0) {
                        return false;
                    } else {
                        stockBtn.textContent = stockBtnInt -= 1;
                        updateData(target.closest(".admin-block").dataset.id, {
                            inStock: stockBtnInt,
                        });
                    }
                }
            }

            // Удаление товаров
            else if (target.classList.contains("admin-delete-btn")) {
                let id = target.closest(".admin-block").dataset.id;

                target.closest(".admin-block").remove();
                deleteData(id);
            }
        }
    });
};

getData();
update();
