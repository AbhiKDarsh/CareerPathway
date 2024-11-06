// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.post('/submit', async (req, res) => {
  try {
    const { blogId, reason, reportedBy } = req.body;
    const report = new Report({
      blogId,
      reason,
      reportedBy,
    });
    await report.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

module.exports = router;
