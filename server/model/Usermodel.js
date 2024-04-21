const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Skey = "saiyedfahzainahmedrizwan";

const counterSchema = new mongoose.Schema({
    model: String,
    field: String,
    count: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const getNextId = async (modelName) => {
    const counter = await Counter.findOneAndUpdate(
        { model: modelName },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    );
    return counter.count;
};

const userSchema = new mongoose.Schema({
    enrollmentNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    IsBlocked: {
        type: Number,
        default: 0,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.generateAuthtoken = async function (res) {
    try {
        let token1 = jwt.sign({ _id: this._id }, Skey, {
            expiresIn: "1d",
        });

        this.tokens = this.tokens.concat({ token: token1 });
        await this.save();
        console.log(token1);
        return token1;
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
