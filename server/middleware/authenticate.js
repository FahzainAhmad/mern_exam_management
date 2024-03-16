const jwt = require("jsonwebtoken");
const userdb = require("../model/Usermodel");
const facultydb = require("../model/Facultymodel");

const userSkey = "saiyedfahzainahmedrizwan";
const facultySkey = "facultytablesecurity";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        console.log("T : " + token);

        let verifytoken, rootUser;

        try {
            verifytoken = jwt.verify(token, userSkey);
            rootUser = await userdb.findOne({ _id: verifytoken._id });
        } catch (errorUser) {
            try {
                verifytoken = jwt.verify(token, facultySkey);
                rootUser = await facultydb.findOne({ _id: verifytoken._id });
            } catch (errorFaculty) {
                throw new Error("Invalid token or user not found");
            }
        }

        console.log(rootUser);

        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            status: 401,
            message: "Unauthorized, no valid token provided",
        });
    }
};

module.exports = authenticate;
