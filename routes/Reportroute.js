// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { getAllReports, blockBlog, unblockBlog, deleteBlog } = require('../controllers/reportcontroller');

// Get all reported blogs (admin only)
router.get('/reports', getAllReports);

// Change block and unblock to PUT requests
router.put('/block/:blogId', blockBlog);
router.put('/unblock/:blogId', unblockBlog);

// Delete reported blog
router.delete('/delete/:blogId', deleteBlog);

module.exports = router;
