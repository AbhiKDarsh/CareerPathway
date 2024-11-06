const express = require('express');
const router = express.Router();
const jobModel = require('../models/JobModel'); // Correct model import
const jobmodel = require('../models/JobModel');



// POST route to create a new course
router.post('/', async (req, res) => {
  const { name, description, eligibility, industry, category } = req.body;

//   // Validate required fields
  if (!name || !description || !eligibility || !industry || !category) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  try {
    //check if job already exist
    const existingJob = await jobmodel.findOne({ name: name });
    if (existingJob) {
      return res.status(400).json({ message: 'Job already exists.' });
      }

    // Create new Course document
    const newjob = new jobModel({
      name,
      description,
      eligibility,
      industry,
      category
    });

    // Save to database
    await newjob.save();

    // Return success response
    res.status(201).json({
      message: 'Job added successfully',
      job: newjob
    });

  } catch (error) {
    console.error('Error creating Job:', error.message);
    res.status(500).json({ message: 'Server error, unable to create course' });
  }
});

// PUT route to update a job by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, eligibility, industry, category } = req.body;

  try {
    // Find job by ID and update its fields
    const updatedJob = await jobModel.findByIdAndUpdate(
      id,
      { name, description, eligibility, industry, category },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Return the updated job data
    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob,
    });
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ message: 'Server error, unable to update job' });
  }
});


module.exports = router;
