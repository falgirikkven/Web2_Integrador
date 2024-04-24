"use strict";

import { getProductsPromise } from "./product-data.js";
import { handleAddToCart } from "./shop-cart.js";

let card_container = undefined;
let products = undefined;

const sale_ico_path = "sale-icon.png";

document.addEventListener("DOMContentLoaded", () => {
    card_container = document.getElementById("card-container");
    getProductsPromise().then((data) => {
        products = data;
        createCards();
    });
});

function createCard(product) {
    const card = document.createElement("div");
    const subcard = document.createElement("div");
    const sale_ico = document.createElement("img");
    const image = document.createElement("img");
    const title = document.createElement("h3");
    const price = document.createElement("p");
    const category = document.createElement("p");
    const description = document.createElement("p");
    const button = document.createElement("button");
    card.classList.add("card-product");
    card.appendChild(subcard);
    subcard.setAttribute("title", product.description);
    subcard.appendChild(sale_ico);
    sale_ico.setAttribute("src", sale_ico_path);
    sale_ico.classList.add("sale");
    sale_ico.classList.add("hide");
    subcard.appendChild(image);
    image.setAttribute("src", product.image);
    subcard.appendChild(title);
    title.innerText = product.title;
    subcard.appendChild(price);
    price.classList.add("price");
    if (product.discount === 0) {
        price.innerHTML = `<span>${product.price.toFixed(2)} US$</span>`;
    } else {
        card.classList.add("discounted");
        sale_ico.classList.remove("hide");
        let discountedPrice = (product.price * (1 - product.discount)).toFixed(
            2
        );
        let discountPercent = (product.discount * 100).toFixed(0);
        price.innerHTML = `<span>${discountedPrice} US$</span> <span class="discount">${discountPercent}%</span> <span class="old-price">${product.price} US$</span>`;
    }
    subcard.appendChild(category);
    category.innerHTML = `Categoría: ${product.category}`;
    subcard.appendChild(description);
    if (product.description.length < 30) {
        description.innerHTML = product.description;
    } else {
        description.innerHTML = product.description
            .substring(0, 27)
            .concat("...");
    }
    card.appendChild(button);
    button.setAttribute("type", "button");
    button.innerText = "Agregar al Carro";
    button.addEventListener("click", () => {
        handleAddToCart(product);
    });
    return card;
}

function createCards() {
    const selected = products.sort(() => 0.5 - Math.random()).slice(0, 16);
    for (let i = 0; i < selected.length; i++) {
        let card = createCard(selected[i]);
        card_container.appendChild(card);
    }
}
