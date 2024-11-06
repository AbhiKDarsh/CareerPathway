const mongoose = require('mongoose');
    const jobSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true, // Name is mandatory
            trim: true, // Removes leading/trailing spaces
            unique: true
        },
        description: {
            type: String,
            required: true,
            minlength: 10 // Ensure description is not too short
        },
        eligibility: {
            type: [String] },
        industry: {
            type: [String]
        },
        category: {
            type: mongoose.Schema.Types.ObjectId, // Reference to Category
            ref: 'Category'
        }
    });

    const jobmodel = mongoose.model("job", jobSchema);
    module.exports = jobmodel;