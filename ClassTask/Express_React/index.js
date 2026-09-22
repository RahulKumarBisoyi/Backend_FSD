import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();

app.use(cors());
app.use(express.json());
// HOME
app.get("/", (req, res) => {
    res.send("Backend is running");
});


// GET - Get all products
app.get("/api/products", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    res.json(products);
});


// GET - Get product by id
app.get("/api/products/:id", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    const id = parseInt(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});


// POST - Add a new product
app.post("/api/products", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    const newProduct = {
        id: products.length > 0
            ? products[products.length - 1].id + 1
            : 1,

        name: req.body.name,
        price: req.body.price
    };

    products.push(newProduct);

    fs.writeFileSync(
        "product.json",
        JSON.stringify(products, null, 2)
    );

    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});


// PUT - Update product by id
app.put("/api/products/:id", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    const products = JSON.parse(data);

    const id = parseInt(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    product.name = req.body.name;
    product.price = req.body.price;

    fs.writeFileSync(
        "product.json",
        JSON.stringify(products, null, 2)
    );

    res.json({
        message: "Product updated successfully",
        product: product
    });
});


// DELETE - Delete product by id
app.delete("/api/products/:id", (req, res) => {

    const data = fs.readFileSync("product.json", "utf-8");
    let products = JSON.parse(data);

    const id = parseInt(req.params.id);

    const product = products.find(
        (product) => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products = products.filter(
        (product) => product.id !== id
    );

    fs.writeFileSync(
        "product.json",
        JSON.stringify(products, null, 2)
    );

    res.json({
        message: "Product deleted successfully"
    });
});


// Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});