const express = require('express');
const router = express.Router();
const JobModel = require('../models/JobModel');

// DELETE route to remove a job by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the job by ID and delete it
        const job = await JobModel.findByIdAndDelete(id);

        // Check if the job was found and deleted
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Return success response
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
