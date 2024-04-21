const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
    position: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    loginTime: {
        type: Date,
        default: Date.now,
    },
    task: {
        type: String,
    },
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;
