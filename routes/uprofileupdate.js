const express = require('express');
const router = express.Router();
const UserModel = require('../models/RegisterModel'); // Ensure the path is correct
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    req.email = decoded.email; // Save email for further use
    next();
  });
};

// Route to update profile details
router.put('/', verifyToken, (req, res) => {
  const { name, phone, education, courses, marks } = req.body;

  // Find the user by email and update the profile details
  UserModel.findOneAndUpdate(
    { email: req.email },
    {
      name: name,
      phone: phone,
      education: education,
      courses: courses,
      marks: marks
    },
    { new: true, runValidators: true } // Return the updated user document
  )
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.json({
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          education: user.education,
          courses: user.courses,
          marks: user.marks
        }
      });
    })
    .catch(error => res.status(500).json({ message: "Error: " + error.message }));
});

module.exports = router;