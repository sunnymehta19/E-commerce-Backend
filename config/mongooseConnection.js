const mongoose = require("mongoose");
const debug = require("debug")("development:mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => debug("MongoDB Connected"))
.catch((err) => debug("MongoDB Connection Error:", err));

module.exports = mongoose.connection;
