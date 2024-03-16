require("dotenv").config();
const express = require("express");
const router = new express.Router();
const authenticate = require("../middleware/authenticate");
const bcrypt = require("bcryptjs");
const userdb = require("../model/Usermodel");
const facultydb = require("../model/Facultymodel");
const LoginHistory = require("../model/LoginHistory");

router.post("/register", async (req, res) => {
    const {
        enrollmentNumber,
        name,
        rollNumber,
        department,
        className,
        division,
        semester,
        password,
        cpassword,
    } = req.body;

    console.log({
        enrollmentNumber,
        name,
        rollNumber,
        department,
        className,
        division,
        semester,
        password,
        cpassword,
    });

    if (
        !enrollmentNumber ||
        !name ||
        !rollNumber ||
        !department ||
        !division ||
        !semester ||
        !password ||
        !cpassword
    ) {
        res.status(422).json({ error: "Fill in all the details" });
    }

    try {
        const preuser = await userdb.findOne({
            enrollmentNumber: enrollmentNumber,
        });

        if (preuser) {
            res.status(422).json({
                error: "This Enrollment Number Already Exist",
            });
            console.log("Enrollment Number Already Exist");
        } else if (password !== cpassword) {
            res.status(422).json({
                error: "Password and Confirm Password does not match",
            });
        } else if (!/^\d+$/.test(enrollmentNumber)) {
            res.status(422).json({
                error: "Enrollment number should not contain characters",
            });
        } else {
            const finalUser = await userdb({
                enrollmentNumber: enrollmentNumber,
                name: name,
                rollNumber: rollNumber,
                department: department,
                className: className,
                division: division,
                semester: semester,
                password: password,
            });
            console.log("Registration Succesfully");
            const data = await finalUser.save();
            res.status(201).json({ status: 201, data });
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch error :", error);
    }
});

router.post("/facultyregister", async (req, res) => {
    const { employeeNumber, name, department, designation, password } =
        req.body;

    console.log({
        employeeNumber,
        name,
        department,
        designation,
        password,
    });

    if (!employeeNumber || !name || !department || !designation || !password) {
        res.status(422).json({ error: "Fill in all the details" });
    }

    try {
        const preuser = await facultydb.findOne({
            employeeNumber: employeeNumber,
        });

        if (preuser) {
            res.status(422).json({
                error: "This Employee Number Already Exist",
            });
            console.log("Employee Number Already Exist");
        } else if (!/^\d+$/.test(employeeNumber)) {
            res.status(422).json({
                error: "Employee number should not contain characters",
            });
        } else {
            const finalUser = await facultydb({
                employeeNumber: employeeNumber,
                name: name,
                department: department,
                designation: designation,
                password: password,
            });
            console.log("Registration Successfully");
            const data = await finalUser.save();
            res.status(201).json({ status: 201, data });
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch error :", error);
    }
});

router.get("/getdata", async (req, res) => {
    try {
        const getAllData = await infodb.find();
        res.status(201).json(getAllData);
    } catch (error) {
        res.status(422).json(error);
    }
});

router.post("/login", async (req, res) => {
    const { enrollno, password } = req.body;
    console.log(enrollno, password);
    if (!enrollno || !password) {
        res.status(422).json({ error: "fill all the details" });
    }

    try {
        const userValid = await userdb.findOne({ enrollmentNumber: enrollno });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            console.log("55" + isMatch);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid details" });
            } else {
                //token genrate

                const token = await userValid.generateAuthtoken(res);
                //cookie Genrate
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: false,
                });
                const result = {
                    userValid,
                    token,
                };
                res.status(202).json({ status: 202, result });
            }
        } else {
            res.status(422).json({ error: "User does not Exist!" });
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("catch block", error);
    }
});

router.post("/login-history", async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userdb.findById(userId);
        if (user) {
            const loginHistory = new LoginHistory({
                user: userId,
                position: "student",
            });
            await loginHistory.save();
            res.status(201).json({
                message: "Login history data saved successfully",
            });
        } else {
            const faculty = await facultydb.findById(userId);
            if (faculty) {
                const loginHistory = new LoginHistory({
                    user: userId,
                    position: "faculty",
                });
                await loginHistory.save();
                res.status(201).json({
                    message: "Login history data saved successfully",
                });
            } else {
                res.status(404).json({
                    error: "User not found in User or Faculty table",
                });
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;

router.post("/facultylogin", async (req, res) => {
    const { empno, password } = req.body;
    console.log("before");
    if (empno === "0000" && password === "Fahzain1>") {
        console.log("After");
        res.status(202).json({ status: 202, message: "Admin" });
        return;
    }

    console.log(empno, password);
    if (!empno || !password) {
        res.status(422).json({ error: "Fill all the details" });
    }

    try {
        const userValid = await facultydb.findOne({ employeeNumber: empno });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            console.log("55" + isMatch);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid details" });
            } else {
                const token = await userValid.generateAuthtoken(res);
                // Cookie Generate
                res.cookie("faccookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: false,
                });
                const result = {
                    userValid,
                    token,
                };
                res.status(202).json({
                    status: 202,
                    result,
                    message: "Fac",
                });
            }
        } else {
            res.status(422).json({ error: "User does not Exist!" });
        }
    } catch (error) {
        res.status(422).json(error);
        console.log("Catch block", error);
    }
});

router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validUserOne = await userdb.findOne({ _id: req.userId });
        res.status(201).json({ status: 201, validUserOne });
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});

router.get("/validfac", authenticate, async (req, res) => {
    try {
        const validUserOne = await facultydb.findOne({ _id: req.userId });
        res.status(201).json({ status: 201, validUserOne });
    } catch (error) {
        res.status(401).json({ status: 401, error });
    }
});

router.get("/logout", authenticate, async (req, res) => {
    try {
        console.log("done");
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.tokens !== req.token;
        });
        res.clearCookie("usercookie", { path: "/" });
        req.rootUser.save();
        console.log("User Logout");
        res.status(201).json({ status: 201 });
    } catch (error) {
        console.log("Error");
        res.status(401).json({ status: 401, error });
    }
});

router.get("/logoutfac", authenticate, async (req, res) => {
    try {
        console.log("done");
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.tokens !== req.token;
        });
        res.clearCookie("faccookie", { path: "/" });
        req.rootUser.save();
        console.log("User Logout");
        res.status(201).json({ status: 201 });
    } catch (error) {
        console.log("Error");
        res.status(401).json({ status: 401, error });
    }
});

router.get("/getallfac", async (req, res) => {
    try {
        const facultyData = await facultydb.find();
        res.json(facultyData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/deleteEmployee/:employeeNumber", async (req, res) => {
    try {
        const { employeeNumber } = req.params;
        console.log(employeeNumber);
        const result = await facultydb.deleteOne({ employeeNumber });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: "Employee deleted successfully" });
        } else {
            console.log("nah");
            res.status(422).json({ error: "Employee not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/editEmployee/:employeeNumber", async (req, res) => {
    try {
        const { employeeNumber } = req.params;
        const updatedFacultyData = req.body;
        console.log(employeeNumber);
        console.log(updatedFacultyData);

        const result = await facultydb.updateOne(
            { employeeNumber: employeeNumber },
            { $set: updatedFacultyData }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: "Employee updated successfully" });
        } else {
            res.status(404).json({
                error: "Employee not found or no changes made",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
