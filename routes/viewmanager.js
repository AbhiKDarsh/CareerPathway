const express = require('express');
const router = express.Router();
const ManagerModel = require('../models/AddManager'); // Assuming ManagerModel exists in models folder

// Get all managers
router.get('/all', async (req, res) => {
    try {
        const managers = await ManagerModel.find();
        res.json(managers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get manager by ID
router.get('/:id', async (req, res) => {
    try {
        const manager = await ManagerModel.findById(req.params.id);
        if (!manager) return res.status(404).json({ message: 'Manager not found' });
        res.json(manager);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
