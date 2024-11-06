//controllers/reportcontrollers.js

const Report = require('../models/Report');
const Blog = require('../models/BlogModel');
const User = require('../models/RegisterModel');

// Submit a new report
const submitReport = async (req, res) => {
  console.log(req.body)
  const { blogId, reason, userId } = req.body;
      
  try {
    // Ensure the blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has already reported this blog
    const existingReport = await Report.findOne({ blogId, reportedBy: userId });
    if (existingReport) {
      return res.status(400).json({ error: 'You have already reported this blog' });
    }

    // Create and save the new report
    const report = new Report({
      blogId,
      reason,
      reportedBy: userId
    });

    await report.save();

    return res.status(201).json({ message: 'Report submitted successfully', report });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Get all reports (admin only)
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('blogId', 'title content image status')
      .populate('reportedBy', 'username email');

    return res.status(200).json(reports);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Block a reported blog (admin only)
const blockBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.status = 'blocked';
    await blog.save();

    return res.status(200).json({ message: 'Blog has been blocked successfully', status: blog.status });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Unblock a blog (admin only)
const unblockBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.status = 'active';
    await blog.save();

    return res.status(200).json({ message: 'Blog has been unblocked successfully', status: blog.status });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Delete a reported blog (admin only)
const deleteBlog = async (req, res) => {
  const { blogId } = req.params;
  
  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(blogId);
    await Report.deleteMany({ blogId });

    return res.status(200).json({ message: 'Blog and associated reports deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

module.exports = {
  submitReport,
  getAllReports,
  blockBlog,
  unblockBlog,
  deleteBlog,
}; 