const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ManagerModel = require('../models/AddManager');

router.post('/', async (req, res) => {
  const { name, email, password, confirmPass } = req.body;

  // Backend validation for password and confirm password
  if (!password || !confirmPass || password !== confirmPass) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Check if the manager already exists
    const existingManager = await ManagerModel.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ message: 'Manager already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create manager in ManagerModel
    const manager = await ManagerModel.create({
      name,
      email,
      password: hashedPassword, // Store hashed password only
      confirmPass: hashedPassword,
      role:2,
    });

    // Send success response
    res.status(201).json({ message: "Manager created successfully", manager });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: 'Error creating manager', error });
    console.log(error);
  }
});

module.exports = router;
