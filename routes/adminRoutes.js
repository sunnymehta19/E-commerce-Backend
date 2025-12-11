const express = require("express");
const router = express.Router();

const upload = require("../config/multerConfig");
const isOwner = require("../middlewares/isOwner");

const productModel = require("../models/productModel");
const userModel = require("../models/userModel");


// -----------------------------------
// ✅ 1. CREATE PRODUCT (GET PAGE)
// -----------------------------------
router.get("/create-product", isOwner, (req, res) => {
    let success = req.flash("success");
    res.render("admin/createProduct", { success });
});


// -----------------------------------
// ✅ 1B. CREATE PRODUCT (POST)
// -----------------------------------
router.post("/create-product", isOwner, upload.single("avatar"), async (req, res) => {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        await productModel.create({
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
            image: req.file.buffer
        });

        req.flash("success", "Product Created Successfully!");
        res.redirect("/admin/create-product");

    } catch (err) {
        res.send(err.message);
    }
});


// -----------------------------------
// ✅ 2. EDIT PRODUCT (GET PAGE)
// -----------------------------------
router.get("/edit-product/:id", isOwner, async (req, res) => {
    const product = await productModel.findById(req.params.id);

    if (!product) return res.send("Product not found!");

    res.render("admin/editProduct", { product });
});


// -----------------------------------
// ✅ 2B. EDIT PRODUCT (POST)
// -----------------------------------
router.post("/edit-product/:id", isOwner, upload.single("avatar"), async (req, res) => {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        const updateData = {
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
        };

        // If a new image is uploaded
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        await productModel.findByIdAndUpdate(req.params.id, updateData);

        req.flash("success", "Product Updated Successfully!");
        res.redirect("/admin/manage-products");

    } catch (err) {
        res.send(err.message);
    }
});


// -----------------------------------
// ✅ 3. ADMIN ORDERS PAGE (GET)
// -----------------------------------
router.get("/orders", isOwner, async (req, res) => {
    let users = await userModel.find({})
        .populate("order.items.product");

    // Flatten all orders combined
    let orders = [];

    users.forEach(user => {
        user.order.forEach(o => {
            orders.push({
                user: user.username,
                email: user.email,
                ...o
            });
        });
    });

    res.render("admin/orders", { orders });
});


// -----------------------------------
module.exports = router;
