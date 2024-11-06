const express = require('express');
const router = express.Router();
const JobModel = require('../models/JobModel');

// Get all Jobs
router.get('/all', async (req, res) => {
    try {
        let query = {};
        if (req.query.categories) {
            const categories = req.query.categories.split(',');
            query.category = { $in: categories };
        }
        if (req.query.subcategories) {
            const subcategories = req.query.subcategories.split(',');
            query.subcategory = { $in: subcategories };
        }
        const jobs = await JobModel.find(query).populate('category');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Job by Id
router.get('/:id', async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id).populate('category');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
