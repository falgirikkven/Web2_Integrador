const cors = require("cors");
const express = require("express");
const path = require("path");
const ps = require("./products.service.js");
const ws = require("./writer.service.js");

const app = express();
const publicPath = path.join(__dirname, "public");
const port = 3000;

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(`${publicPath}/index.html`);
});

app.get("/products", (req, res) => {
    let products = ps.getProducts();
    if (!products) {
        res.status(500).send({
            error: "Something failed! Refresh page in 10 seconds",
        });
    } else {
        res.send(products);
    }
});

// cart
app.post("/shop", (req, res) => {
    if (req.body === undefined || req.body === null) {
        res.statusMessage = "Null cart";
        res.sendStatus(400);
        return;
    }
    if (req.body.length === 0) {
        res.statusMessage = "Empty cart";
        res.sendStatus(400);
        return;
    }

    console.log("BODY: ", req.body);
    const cartItems = req.body.reduce((acc, curr) => {
        acc.push(curr[1]);
        return acc;
    }, []);
    const total = cartItems.reduce((acc, item) => {
        const product = ps.getProducts().find((p) => p.id === item.id);
        return acc + product.price * (1 - product.discount) * item.quantity;
    }, 0);
    const opperation = { cartItems: cartItems, total: total };

    ws.writeData(opperation);
    res.sendStatus(201);
});

// start app
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
