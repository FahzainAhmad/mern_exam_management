const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routes/router");
const AdminAccs = require("../server/model/Adminaccs");
const bcrypt = require("bcryptjs");

require("./db/conn");
const port = 5000;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(router);
app.use(cookieParser());

const checkAdminAccount = async () => {
    try {
        const adminAccount = await AdminAccs.findOne({
            email: "admin@gmail.com",
        });

        if (!adminAccount) {
            const hashedPassword = await bcrypt.hash("Fahzain1>", 10);
            const newAdmin = new AdminAccs({
                email: "admin@gmail.com",
                password: hashedPassword,
            });

            await newAdmin.save();
            console.log("Admin account created successfully");
        } else {
            console.log("Admin account already exists");
        }
    } catch (error) {
        console.error("Error checking/admin account:", error);
    }
};

// Call the function to check for and create admin account on server startup
checkAdminAccount();

app.listen(port, () => {
    console.log(`Server created at: ${port}`);
});
