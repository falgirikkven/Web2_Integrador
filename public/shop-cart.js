"use strict";

let cart;

function updateCartCounter() {
    const counter = document.getElementById("cart-len");
    let count = 0;
    cart.forEach((cartItem, _) => {
        if (cartItem.quantity > 0) {
            count += cartItem.quantity;
        }
    });
    counter.innerHTML = count;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(Array.from(cart.entries())));
}

function handleAddToCart(product) {
    const productID = product.id;
    if (productID != undefined && !cart.has(productID)) {
        const cartItem = {};
        cartItem.id = productID;
        cartItem.quantity = 1;
        cartItem.price = product.price;
        cartItem.discount = product.discount;
        cart.set(productID, cartItem);
        saveCart();
        updateCartCounter();
    }
}

function handleGetQuantity(productID) {
    if (cart.has(productID)) {
        return cart.get(productID).quantity;
    }
    return -1;
}

function handleDecressQuantity(productID) {
    if (cart.has(productID)) {
        const cartItem = cart.get(productID);
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
            cart.set(productID, cartItem);
            saveCart();
            updateCartCounter();
        }
    }
}

function handleIncressQuantity(productID) {
    if (cart.has(productID)) {
        const cartItem = cart.get(productID);
        if (cartItem.quantity >= 1) {
            cartItem.quantity += 1;
            cart.set(productID, cartItem);
            saveCart();
            updateCartCounter();
        }
    }
}

function handleDeleteItem(productID) {
    if (cart.has(productID)) {
        cart.delete(productID);
        saveCart();
        updateCartCounter();
    }
}

function getTotalPrice() {
    let price = 0;
    cart.forEach((ci, _) => {
        if (ci.quantity > 0) {
            price += ci.price * (1 - ci.discount) * ci.quantity;
        }
    });
    return price;
}

function getCartData() {
    return new Map(cart);
}

function clearCart() {
    console.log(cart.size);
    cart.clear();
    saveCart()
    console.log(cart.size);
}

function submitCart() {
    if (cart.size > 0) {
        const msg = JSON.stringify(Array.from(cart.entries()));
        fetch("/shop", {
            method: "POST",
            body: msg,
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((_) => {})
            .catch((error) => console.error(error));
        clearCart();
    }
}

function __on_innit() {
    let data = localStorage.getItem("cart");
    if (data === null || data === undefined) {
        cart = new Map();
    } else {
        cart = new Map(JSON.parse(data));
    }
    updateCartCounter();
}

__on_innit();

export {
    getCartData,
    getTotalPrice,
    handleAddToCart,
    handleGetQuantity,
    handleDecressQuantity,
    handleIncressQuantity,
    handleDeleteItem,
    submitCart,
};
