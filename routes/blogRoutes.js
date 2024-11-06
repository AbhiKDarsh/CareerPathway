// routes/blogRoutes.js
const express = require('express');
const Blog = require('../models/BlogModel');
const multer = require('multer'); 
const fs = require('fs');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Make sure to import jwt

// Ensure 'uploads/' folder exists
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};


// Add a new blog (protected route)
router.post('/add', upload.single('image'), async (req, res) => {
  console.log(req.body);
  try {
    const { title, content, author } = req.body;
    const image = req.file ?  `/uploads/${req.file.filename}` : '';
    const newBlog = new Blog({ title, content, author, image });
    await newBlog.save();
    res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Error adding blog' });
  }
});


// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({status:'active'}).populate('author', 'name');
    res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching blogs' });
  }
});

// Delete a blog (protected route)
router.delete('/delete/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the current user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting blog' });
  }
});

// Edit a blog (protected route)
router.put('/edit/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if the current user is the author of the blog
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this blog' });
    }

    const { title, content } = req.body;
    const updateData = { title, content };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    return res.status(500).json({ error: 'Error updating blog' });
  }
});

module.exports = router;
