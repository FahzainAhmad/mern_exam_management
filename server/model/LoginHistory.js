const mongoose = require("mongoose");
const User = require("./Usermodel");
const Faculty = require("./Facultymodel");

const loginHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
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
});

loginHistorySchema.pre("save", async function (next) {
    try {
        const user = await User.findById(this.user);
        if (user) {
            this.userName = user.name;
            this.position = "student";
        } else {
            const faculty = await Faculty.findById(this.user);
            if (faculty) {
                this.userName = faculty.name;
                this.position = "faculty";
            } else {
                throw new Error("User not found in User or Faculty table");
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;
