const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    examId: {
        type: String,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    correctAnswers: {
        type: Number,
        required: true,
    },
    noneAnswers: {
        type: Number,
        required: true,
    },
    percentage: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    feedback: {
        type: String,
        required: false,
    },
    examDuration: {
        type: String,
        required: true,
    },
});

const ExamResult = mongoose.model("ExamResult", examResultSchema);

module.exports = ExamResult;
