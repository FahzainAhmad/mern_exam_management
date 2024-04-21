const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
    facultyId: {
        type: Number,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date, // Date type to store both date and time
        required: true,
    },
    endTime: {
        type: Date, // Date type to store both date and time
        required: true,
    },
    questions: {
        type: String, // Array of strings to store questions
        required: true,
    },
    passingMarks: {
        type: Number,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
