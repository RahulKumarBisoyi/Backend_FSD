import express from "express";
import fs from "fs";

const app = express();
app.use(express.json());

const filePath = "./product.json";
let products = JSON.parse(
    fs.readFileSync(filePath, "utf-8")
);
function saveProducts() {
    fs.writeFileSync(
        filePath,
        JSON.stringify(products, null, 2)
    );
}
app.get("/products", (req, res) => {
    res.json(products);
});
app.get("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        product => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    res.json(product);
});

app.post("/products", (req, res) => {
    const newProduct = {
        id: products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,

        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock
    };

    products.push(newProduct);
    saveProducts();
    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});

app.put("/products/:id", (req, res) => {

    const id = Number(req.params.id);
    const product = products.find(
        product => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    product.name = req.body.name;
    product.price = req.body.price;
    product.category = req.body.category;
    product.stock = req.body.stock;

    saveProducts();

    res.json({
        message: "Product updated successfully",
        product: product
    });
});

app.delete("/products/:id", (req, res) => {

    const id = Number(req.params.id);

    const product = products.find(
        product => product.id === id
    );

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    products = products.filter(
        product => product.id !== id
    );

    saveProducts();

    res.json({
        message: "Product deleted successfully"
    });
});

app.listen(8000, () => {
    console.log(
        "Server running on http://localhost:8000"
    );
});