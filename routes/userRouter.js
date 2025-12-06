const express = require("express");
const router = express.Router();
const {registerUser} = require("../controllers/authController")

router.get("/", (req, res) => {
    res.send("I am sunny");
});

router.post("/register", registerUser );

module.exports = router;

