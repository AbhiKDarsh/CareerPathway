// CourseModel.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    eligibility: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Category
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: String, // Store subcategory as a string
        required: true
    },
    job: {
        type: [String]
    },
    entrance: {
        type: [String]
    },
    duration: {
        type: Number, // Duration in months
        required: true
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
