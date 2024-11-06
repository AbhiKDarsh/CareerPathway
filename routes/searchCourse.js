const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');

// Search for Entrance
router.get('/searchentr', async (req, res) => {
    const { query } = req.query; // Get the search query from URL parameters

    try {
        // Perform a case-insensitive search in 'name', 'description', and 'eligibility' fields
        const course = await Course.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // case-insensitive search on 'name'
                { description: { $regex: query, $options: 'i' } }, // case-insensitive search on 'description'
                { fullName: { $regex: query, $options: 'i' } },
                { job: { $regex: query, $options: 'i' } },
                { course: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json(course); // Return the matching scholarships
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching for entrances', error });
    }
});

module.exports = router;