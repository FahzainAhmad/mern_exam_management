const mongoose = require("mongoose");

const adminAccsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const AdminAccs = mongoose.model("AdminAccs", adminAccsSchema);

module.exports = AdminAccs;
