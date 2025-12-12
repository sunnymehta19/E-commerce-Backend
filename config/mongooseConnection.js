const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("MONGODB_URI is missing!");
    process.exit(1);
}

mongoose.connect(`${MONGO_URI}/bagVerse`)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

module.exports = mongoose.connection;
