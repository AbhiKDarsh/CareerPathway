const express = require('express');
const router = express.Router();
const CourseModel = require('../models/CourseModel'); // Ensure this points to CourseModel

// DELETE route to remove a course by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the course by ID and delete it
        const course = await CourseModel.findByIdAndDelete(id);

        // Check if the course was found and deleted
        if (!course) {
            return res.status(404).json({ message: 'Course not found' }); // HTTP 404 Not Found
        }

        // Return success response
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
