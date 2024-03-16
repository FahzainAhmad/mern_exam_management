const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Skey = "facultytablesecurity";

const getNextId = async (modelName) => {
    const counter = await Counter.findOneAndUpdate(
        { model: modelName },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
    );
    return counter.count;
};

const facultySchema = new mongoose.Schema({
    employeeNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
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

facultySchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

facultySchema.methods.generateAuthtoken = async function (res) {
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

const User = mongoose.model("Faculty", facultySchema);

module.exports = User;
