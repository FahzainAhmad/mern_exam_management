const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
    examId: {
        type: String,
        required: true,
    },
    facultyId: {
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
