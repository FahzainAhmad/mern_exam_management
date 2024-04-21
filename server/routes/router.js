require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = new express.Router();
const authenticate = require("../middleware/authenticate");
const bcrypt = require("bcryptjs");
const xlsx = require("xlsx");
const fs = require("fs");
const userdb = require("../model/Usermodel");
const facultydb = require("../model/Facultymodel");
const LoginHistory = require("../model/LoginHistory");
const ExamData = require("../model/Examdata");
const ExamResult = require("../model/ExamResult");
const ResourcesModel = require("../model/Resources");
const moment = require("moment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const storage1 = multer.diskStorage({
    destination: "./uploads/resources/",
    filename: function (req, file, cb) {
        const examId = req.body.examId;
        const facultyId = req.body.facultyId;
        const fileNo = req.files.length;
        const extension = path.extname(file.originalname);
        const filename = `${examId}-${fileNo}${extension}`;
        cb(null, file.originalname);
    },
});

router.get("/download/:filename", function (req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/resources", filename);
    res.download(filePath, filename); // Set disposition and send the file
});

const upload1 = multer({
    storage: storage1,
    limits: { fileSize: 30 * 1024 * 1024 },
}).array("resources", 20);

router.post("/uploadres", authenticate, (req, res) => {
    console.log("HUHGDIUWQBDIUWQB");
    upload1(req, res, (err) => {
        if (err) {
            // Multer error handling
            console.error(err);
            return res.status(400).json({ error: "Error uploading files." });
        }

        // Files uploaded successfully
        const files = req.files; // Get the array of uploaded files
        const examId = req.body.examId; // Get the associated exam ID from the request body
        const facultyId = req.userId; // Get the faculty ID from the request object
        const dateCreated = new Date(); // Get the current date/time

        // Save file information and associate them with the exam in your database
        const resources = files.map((file) => ({
            examId: examId,
            facultyId: facultyId,
            filename: file.filename, // Save the generated filename
            dateCreated: dateCreated,
            // You can add more information such as file size, mime type, etc.
        }));

        ResourcesModel.insertMany(resources)
            .then((savedResources) => {
                // Files information saved successfully
                res.status(200).json({
                    message: "Files uploaded successfully.",
                });
                console.log("done");
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    error: "Error saving file information.",
                });
            });
    });
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
            if (userValid.IsBlocked === 1) {
                return res.status(202).json({ error: "User is blocked" });
            }

            const isMatch = await bcrypt.compare(password, userValid.password);
            console.log("55" + isMatch);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid details" });
            } else {
                //token genrate
                const loginHistory = new LoginHistory({
                    position: "student",
                    userName: enrollno,
                    loginTime: new Date(),
                    task: "login",
                });
                await loginHistory.save();

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

router.get("/login-history-student", async (req, res) => {
    try {
        // Find all login history where position is "student"
        const studentLoginHistory = await LoginHistory.find({
            position: "student",
        });

        // Return the login history
        res.status(200).json({ status: 200, data: studentLoginHistory });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error fetching student login history:", error);
    }
});

router.get("/login-history-fac", async (req, res) => {
    try {
        const facultyLoginHistory = await LoginHistory.find();

        // Return the login history
        res.status(200).json({ status: 200, data: facultyLoginHistory });
        console.log(facultyLoginHistory);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error fetching student login history:", error);
    }
});

router.get("/blockedstudentlist", async (req, res) => {
    try {
        const blockedstudentlist = await userdb.find();
        console.log(blockedstudentlist);
        res.status(200).json({ status: 200, data: blockedstudentlist });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Error fetching student login history:", error);
    }
});

router.put("/blockstudent/:studentId", async (req, res) => {
    const { studentId } = req.params;
    const { isBlocked } = req.body;

    try {
        const result = await userdb.updateOne(
            { _id: studentId },
            { $set: { IsBlocked: isBlocked ? 1 : 0 } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({
            message: `Student ${
                isBlocked ? "blocked" : "unblocked"
            } successfully`,
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/bsstudent/:enrollmentNumber", async (req, res) => {
    const { enrollmentNumber } = req.params;

    try {
        const student = await userdb.findOne({
            enrollmentNumber: enrollmentNumber,
        });

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error("Error fetching student data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/blockunstudent/:studentId", async (req, res) => {
    const { studentId } = req.params;
    const { isBlocked } = req.body;

    try {
        const result = await userdb.updateOne(
            { _id: studentId },
            { $set: { IsBlocked: isBlocked ? 1 : 0 } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({
            message: `Student ${
                isBlocked ? "blocked" : "unblocked"
            } successfully`,
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Internal server error" });
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
                const loginHistory = new LoginHistory({
                    position: "faculty",
                    userName: empno,
                    loginTime: new Date(),
                    task: "login",
                });
                await loginHistory.save();
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
        if (validUserOne.IsBlocked === 1) {
            return res.status(201).json({ error: "User is blocked" });
        }
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

router.get("/getallstudent", async (req, res) => {
    try {
        const studentData = await userdb.find();
        res.json(studentData);
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

router.delete("/deleteStudent/:enrollmentNumber", async (req, res) => {
    try {
        const { enrollmentNumber } = req.params;
        console.log(enrollmentNumber);
        const result = await userdb.deleteOne({ enrollmentNumber });

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

router.post("/addexam", upload.single("questionsFile"), async (req, res) => {
    const {
        facultyId,
        division,
        semester,
        department,
        subject,
        startTime,
        endTime,
        passingMarks,
    } = req.body;
    const questionsFile = req.file;

    console.log(req.body);

    // Given date
    const startDate = new Date(startTime);

    startDate.setHours(startDate.getHours() + 5);
    startDate.setMinutes(startDate.getMinutes() + 30);

    const startTimeUTC = startDate.toISOString();

    const endDate = new Date(endTime);

    endDate.setHours(endDate.getHours() + 5);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const endTimeUTC = endDate.toISOString();

    // Check if questionsFile exists
    if (!questionsFile) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the Excel file
    const workbook = xlsx.readFile(questionsFile.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    const questionsAsString = JSON.stringify(jsonData);
    // Save form data and JSON data into MongoDB
    try {
        const examData = new ExamData({
            facultyId,
            division,
            semester,
            department,
            subject,
            //startTime: startTimeUTC,
            //endTime: endTimeUTC,
            startTime,
            endTime,
            passingMarks,
            questions: questionsAsString,
        });

        console.log(examData);
        await examData.save();
        console.log("Exam data saved to MongoDB");
        res.json({ message: "Exam added successfully" });
    } catch (error) {
        console.error("Error saving exam data to MongoDB:", error);
        res.status(500).json({ error: "Internal server error" });
    }

    fs.unlinkSync(questionsFile.path);
});

router.get("/getexamsdata", authenticate, async (req, res) => {
    try {
        const { userId } = req;
        const facultyMember = await facultydb.findOne({ _id: userId });
        const empNo = facultyMember.employeeNumber;
        console.log("UserID : " + userId);
        const examsData = await ExamData.find({ facultyId: empNo });
        res.json(examsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/deleteexam/:examId", async (req, res) => {
    try {
        const { examId } = req.params;
        const deletedExam = await ExamData.findByIdAndDelete(examId);

        if (!deletedExam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        res.json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Error deleting exam:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getresourcedata", authenticate, async (req, res) => {
    try {
        // Fetch distinct examIds from resources collection
        const distinctExamIds = await ResourcesModel.distinct("examId");

        // Fetch exam details for exams that have associated resources
        const examDetailsWithResources = await Promise.all(
            distinctExamIds.map(async (examId) => {
                const exam = await ExamData.findById(examId);
                if (exam) {
                    const resources = await ResourcesModel.find({ examId });
                    return {
                        examId: exam._id,
                        examName: exam.subject,
                        examDiv: exam.division,
                        examSem: exam.semester,
                        examDep: exam.department, // Assuming exam has a name field
                        resources,
                    };
                }
            })
        );

        // Filter out undefined values (in case an exam is not found)
        const validExamDetails = examDetailsWithResources.filter(
            (details) => details
        );

        // Send the combined data to the client
        res.json(validExamDetails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get("/getstudentexams", authenticate, async (req, res) => {
    try {
        const { userId } = req;
        const user = await userdb.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { division, semester, department } = user;

        const examsData = await ExamData.find({
            division: division,
            semester: semester,
            department: department,
        });

        const currentDate = moment();
        // Add examStatus to each exam object
        const examsDataWithStatus = examsData.map((exam) => {
            const startTime = moment(exam.startTime);
            const endTime = moment(exam.endTime);
            let examStatus;
            if (currentDate.isBetween(startTime, endTime)) {
                examStatus = "Ongoing";
            } else if (currentDate.isBefore(startTime)) {
                examStatus = "Upcoming";
            } else {
                examStatus = "Past";
            }
            return { ...exam.toObject(), examStatus };
        });

        res.json(examsDataWithStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/get-test-data", authenticate, async (req, res) => {
    try {
        const { userId } = req;
        const { examId } = req.body;

        const userData = await userdb.findById(userId);
        const examData = await ExamData.findById(examId);

        res.json({ userData, examData });
    } catch (error) {
        console.error("Error taking test:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/getquestions", async (req, res) => {
    try {
        const { examId } = req.body;
        const exam = await ExamData.findOne({ _id: examId });
        console.log(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        const questions = exam.questions;
        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/checkexam", authenticate, async (req, res) => {
    try {
        const { userId } = req;
        const { examId } = req.query;
        const submittedAnswers = req.body;
        console.log("Submitted Ans :" + submittedAnswers.Feedback);

        // Get exam details
        const exam = await ExamData.findById(examId);

        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Parse questions from exam
        const questions = JSON.parse(exam.questions);

        // Calculate duration of exam
        const endTime = new Date(exam.endTime).getTime();
        const submitTime = parseInt(req.query.submitTime);
        const feedback = req.query.feedback;
        const examDuration = (submitTime - endTime) / 1000; // Duration in seconds

        // Convert duration to minutes and seconds
        const minutes = Math.floor(examDuration / 60).toString();
        const seconds = Math.floor(examDuration % 60).toString();

        // Calculate total marks
        const totalQuestions = questions.length;
        const totalMarks = exam.passingMarks;

        // Calculate number of correct answers
        const correctAnswers = questions.reduce((count, question, index) => {
            const submittedAnswer = submittedAnswers[index].selectedOption;
            const correctAnswer = question.Answer;
            if (submittedAnswer === correctAnswer) {
                count++;
            }
            return count;
        }, 0);

        // Calculate number of submitted answers as "None"
        const noneAnswers = submittedAnswers.filter(
            (answer) => answer.selectedOption === "None"
        ).length;

        // Calculate percentage
        const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);

        // Determine grade
        let grade;
        if (percentage >= 95) {
            grade = "A";
        } else if (percentage >= 70) {
            grade = "B";
        } else if (percentage >= 65) {
            grade = "C";
        } else if (percentage >= 50) {
            grade = "D";
        } else {
            grade = "E";
        }

        // Construct the exam result object
        const examResultData = {
            userId,
            examId,
            totalQuestions,
            totalMarks,
            correctAnswers,
            noneAnswers,
            percentage,
            grade,
            feedback: feedback,
            examDuration: `${minutes}:${seconds}`,
        };

        const examResult = new ExamResult(examResultData);

        // Save the exam result data
        examResult
            .save()
            .then((savedResult) => {
                console.log("Exam result saved successfully:", savedResult);
            })
            .catch((error) => {
                console.error("Error saving exam result:", error);
            });
    } catch (error) {
        console.error("Error checking exam:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getexamresults", authenticate, async (req, res) => {
    try {
        // Get user ID from the authenticated request
        const userId = req.userId;

        // Fetch exam results for the authenticated user
        const examResults = await ExamResult.find({ userId });

        // Collect all examIds from the exam results
        const examIds = examResults.map((result) => result.examId);

        // Fetch exam details for all examIds
        const exams = await ExamData.find({ _id: { $in: examIds } });

        // Create a map of examId to exam details for quick access
        const examMap = exams.reduce((map, exam) => {
            map[exam._id] = exam;
            return map;
        }, {});

        // Attach exam details to each examResult
        const examResultsWithDetails = examResults.map((result) => ({
            ...result.toObject(),
            examDetails: examMap[result.examId],
        }));

        res.json(examResultsWithDetails);
    } catch (error) {
        console.error("Error fetching exam results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/getexamresultsone", authenticate, async (req, res) => {
    const userId = req.userId;

    // Extract examId from the request body
    const { examId } = req.body;

    try {
        // Find the exam result for the specified userId and examId
        const examResult = await ExamResult.findOne({
            userId: userId,
            _id: examId,
        });

        if (!examResult) {
            return res.status(404).json({ error: "Exam result not found" });
        }

        // Fetch exam details for the examId from the examResult
        const exam = await ExamData.findById(examResult.examId);

        if (!exam) {
            return res.status(404).json({ error: "Exam details not found" });
        }

        // Fetch user details from the database using userId
        const user = await userdb.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User details not found" });
        }

        // Attach user details and exam details to the exam result
        const examResultWithDetails = {
            user: user.toObject(),
            examDetails: exam.toObject(),
            ...examResult.toObject(),
        };

        res.json(examResultWithDetails);
    } catch (error) {
        console.error("Error fetching exam result:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/examdatafac", async (req, res) => {
    try {
        // Fetch all exam results
        const examdata = await ExamData.find();

        res.json(examdata);
    } catch (error) {
        console.error("Error fetching exam results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/extractexamresults/:examId", async (req, res) => {
    try {
        const { examId } = req.params;
        console.log(examId);
        const examResults = await ExamResult.find({ examId: examId });
        console.log(examResults);
        const userIds = examResults.map((result) => result.userId);
        const users = await userdb.find({ _id: { $in: userIds } });
        const responseData = examResults.map((result) => {
            const user = users.find((user) => user._id.equals(result.userId));
            return {
                examResult: result,
                user: user,
            };
        });
        console.log(responseData);
        res.json(responseData);
    } catch (error) {
        console.error("Error retrieving exam results:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/edit-exam/:examId", async (req, res) => {
    const { examId } = req.params;
    const newData = req.body; // Updated data from request body

    try {
        // Find the exam by examId and update it with the new data
        const updatedExamResult = await ExamResult.findByIdAndUpdate(
            examId,
            newData,
            { new: true }
        );

        if (!updatedExamResult) {
            return res.status(404).json({ error: "Exam not found" });
        }

        res.json({ message: "Exam updated successfully", updatedExamResult });
    } catch (error) {
        console.error("Error updating exam:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/getresourceexam", authenticate, async (req, res) => {
    const userId = req.userId;
    const faculty = facultydb.find({ _id: userId });
    const examsData = ExamData.find({ facultyId: faculty.employeeNumber });

    res.json(examsData);
});

module.exports = router;
