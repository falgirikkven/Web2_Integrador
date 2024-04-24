"use strict";

import { getProductsPromise } from "./product-data.js";
import {
    getCartData,
    getTotalPrice,
    handleGetQuantity,
    handleDecressQuantity,
    handleIncressQuantity,
    handleDeleteItem,
    submitCart,
} from "./shop-cart.js";

let shop_container = undefined;
let shop_card_container = undefined;
let feedback_container = undefined;
let total_price = undefined;

let btnsubmit = undefined;

let cart = undefined;
let products = undefined;

document.addEventListener("DOMContentLoaded", () => {
    shop_container = document.getElementById("shop-container");
    shop_card_container = document.getElementById("shop-card-container");
    feedback_container = document.getElementById("feedback-container");
    total_price = document.getElementById("cart-totalprice");
    btnsubmit = document.getElementById("confirm");
    btnsubmit.addEventListener("click", () => {
        confirm();
    });

    cart = getCartData();

    if (cart.size > 0) {
        getProductsPromise().then((data) => {
            products = data;
            createCards();
        });
    } else {
        showFeedback();
    }
});

function updateTotal(pid, fun, where) {
    fun(pid);
    where.innerHTML = handleGetQuantity(pid);
    total_price.innerHTML = getTotalPrice().toFixed(2);
}

function updateLocal(where, price, pid) {
    let newPrice = price * handleGetQuantity(pid);
    where.innerHTML = `<span>${newPrice.toFixed(2)} US$</span>`;
}

function createCard(pid, pdata) {
    const product = products.find((p) => p.id == pid);
    const sc_card = document.createElement("div");
    sc_card.classList.add("shop-card");
    const sc_prodimg = document.createElement("img");
    sc_prodimg.setAttribute("src", product.image);
    const sc_info = document.createElement("div");
    sc_info.classList.add("sc-info");
    const sc_text = document.createElement("div");
    sc_text.classList.add("sc-spaced");
    const sc_buttons = document.createElement("div");
    sc_buttons.classList.add("sc-spaced");
    sc_buttons.classList.add("sc-btns");
    sc_card.appendChild(sc_prodimg);
    sc_card.appendChild(sc_info);
    sc_info.appendChild(sc_text);
    sc_info.appendChild(sc_buttons);
    const title = document.createElement("h3");
    sc_text.appendChild(title);
    title.innerText = product.title;
    const prices = document.createElement("p");
    sc_text.appendChild(prices);
    prices.classList.add("price");
    const currprice = document.createElement("span");
    const oldprice = document.createElement("span");
    prices.appendChild(currprice);
    prices.appendChild(oldprice);
    let itemPrice = pdata.price * (1 - pdata.discount);
    let itemOldPrice = pdata.price;
    currprice.innerHTML = `${itemPrice.toFixed(2)} US$`;
    oldprice.innerHTML = `${itemOldPrice.toFixed(2)} US$`;
    oldprice.classList.add("old-price");
    if (pdata.discount === 0) {
        oldprice.classList.add("hide");
    }
    const sc_quant = document.createElement("span");
    sc_quant.classList.add("block");
    sc_quant.classList.add("sc-quantity");
    sc_quant.innerHTML = pdata.quantity;
    const btndecquant = document.createElement("button");
    sc_buttons.appendChild(btndecquant);
    btndecquant.setAttribute("type", "button");
    btndecquant.innerText = "-";
    btndecquant.addEventListener("click", () => {
        updateTotal(pid, handleDecressQuantity, sc_quant);
        updateLocal(currprice, itemPrice, pid);
        updateLocal(oldprice, itemOldPrice, pid);
    });
    sc_buttons.appendChild(sc_quant);
    const btnincquant = document.createElement("button");
    sc_buttons.appendChild(btnincquant);
    btnincquant.setAttribute("type", "button");
    btnincquant.innerText = "+";
    btnincquant.addEventListener("click", () => {
        updateTotal(pid, handleIncressQuantity, sc_quant);
        updateLocal(currprice, itemPrice, pid);
        updateLocal(oldprice, itemOldPrice, pid);
    });
    const btnremove = document.createElement("button");
    sc_buttons.appendChild(btnremove);
    btnremove.setAttribute("type", "button");
    btnremove.innerText = "Quitar";
    btnremove.addEventListener("click", () => {
        try {
            shop_card_container.removeChild(sc_card);
            updateTotal(pid, handleDeleteItem, sc_quant);
            if (getCartData().size === 0) {
                showFeedback();
            }
        } catch (error) {
            console.error(error);
        }
    });
    return sc_card;
}

function createCards() {
    cart.forEach((value, key) => {
        let card = createCard(key, value);
        shop_card_container.appendChild(card);
    });
    total_price.innerHTML = getTotalPrice().toFixed(2);
    feedback_container.classList.add("hide");
    shop_container.classList.remove("hide");
}

function showFeedback(code = 1) {
    // code 1: empty cart
    // code 2: shop saved
    if (code === 1) {
        feedback_container.innerHTML =
            "<p>parece ser que el carro de compra esta vacio</p>";
    } else if (code === 2) {
        feedback_container.innerHTML = "<p>Compra enviada</p>";
    }

    feedback_container.classList.remove("hide");
    shop_container.classList.add("hide");
}

function confirm() {
    submitCart();
    showFeedback(2);
}
