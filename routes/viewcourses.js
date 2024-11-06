const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const courseModel = require('../models/CourseModel');

// Get courses with optional category filtering
router.get('/all', async (req, res) => {
    try {
        const categoryIds = req.query.categories
            ? req.query.categories.split(',').map((id) => new mongoose.Types.ObjectId(id))
            : [];

        const filter = categoryIds.length > 0 ? { category: { $in: categoryIds } } : {};

        const courses = await courseModel.find(filter).populate('category');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});





// Get course by ID with populated category details
router.get('/:id', async (req, res) => {
    try {
        const vcourse = await courseModel.findById(req.params.id).populate('category'); // Populate category field
        if (!vcourse) return res.status(404).json({ message: 'Course not found' });
        res.json(vcourse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
