const becypt = require("bcrypt");
const {generateToken} = require("../utils/generateToken");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let user = await userModel.findOne({email: email})
        if (user) {
            return res.status(401).send("You already have an account, Please Login.")
        }

        becypt.genSalt(10, (err, salt) => {
            becypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(400).send(err.message)
                }
                else {
                    let user = await userModel.create({
                        username,
                        email,
                        password: hash
                    })
                    res.send(user);

                    let token = generateToken(user)
                    res.cookie("token", token);
                    res.send("user created successfully")
                }
            })
        })


    } catch (err) {
        console.log(err.message)
    }
}

module.exports.registerUser = registerUser;

