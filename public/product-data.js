"use strict";

let products = undefined;

async function fetchProducts() {
    let where = "products";

    products = fetch(where)
        .then(async (response) => {
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            } else {
                return response.json();
            }
        })
        .catch((err) => {
            console.error(err);
        });
}

function getProductsPromise() {
    return products;
}

function __on_innit() {
    fetchProducts();
}

__on_innit();

export { getProductsPromise };
