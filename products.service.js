const fs = require("fs");
const translate = require("node-google-translate-skidz");

const URL = "https://fakestoreapi.com/products/";
const DISCOUNTS = "./products-discount.json";
const LOCAL = `./products.json`;
let products = undefined;

const REMOTE = true; // DEV variable
const ENABLE_TRANSLATIONS = true; // DEV variable

function translate_att(obj, prop) {
    try {
        translate(
            {
                text: obj[prop],
                source: "en",
                target: "es",
            },
            function (result) {
                obj[prop] = result.translation;
            }
        );
    } catch (error) {
        console.error(error);
    }
}

async function fetchProducts() {
    let dataProductsApi = undefined;
    let dataProductsDiscounted = undefined;

    // Search for products in the DB
    if (REMOTE) {
        // Remote DB (API)
        await fetch(URL)
            .then((response) => response.json())
            .then((data) => {
                dataProductsApi = data;
            })
            .catch((err) => {
                console.error(err);
            });
    } else {
        // Local DB in JSON file (debug and testing only)
        try {
            dataProductsApi = JSON.parse(fs.readFileSync(LOCAL, "utf-8"));
        } catch (error) {
            console.error(error);
        }
    }

    // Read local discounts DB
    try {
        dataProductsDiscounted = JSON.parse(
            fs.readFileSync(DISCOUNTS, "utf-8")
        );
    } catch (error) {
        console.error(error);
    }

    // Failed to load either the products DB or the discounts DB
    if (!dataProductsApi || !dataProductsDiscounted) {
        console.error("Failed to load products");
        return false;
    }

    // Merge both DB and translate
    products = dataProductsApi.reduce((acc, curr) => {
        const prod = Object.assign({}, curr);
        const prodDisc = dataProductsDiscounted.find((e) => e.id === prod.id);
        let discount = 0;
        if (prodDisc) {
            discount = prodDisc.discount;
        }
        prod.discount = discount;

        if (ENABLE_TRANSLATIONS) {
            translate_att(prod, "title");
            translate_att(prod, "description");
            translate_att(prod, "category");
        }

        acc.push(prod);
        return acc;
    }, []);

    return true;
}

function getProducts() {
    return products;
}

// NO USAR LA BASE DE DATOS LOCAL AL PRESENTAR EL PROYECTO
if (!REMOTE) {
    console.warn(
        "OJO AL PIOJO! producto usa la base de datos local. Cambiar a remoto"
    );
}

// NO USAR LA BASE DE DATOS LOCAL AL PRESENTAR EL PROYECTO
if (!ENABLE_TRANSLATIONS) {
    console.warn(
        "OJO AL PIOJO! las traducciones no están habilitadas. Habilitar traducciones"
    );
}

// get Products
fetchProducts();

module.exports = { getProducts };
