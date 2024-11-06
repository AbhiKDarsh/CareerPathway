//categoryRoutes.js

const express = require('express');
const router = express.Router();
const Category = require('../models/CategoryModel');

// GET route to fetch categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error, unable to fetch categories' });
  }
});

// GET: Fetch subcategories by category ID
router.get('/:id/subcategories', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Send subcategories if found
    res.status(200).json(category.subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error.message);
    res.status(500).json({ message: 'Server error, unable to fetch subcategories' });
  }
});


// POST: Add a new category
router.post('/', async (req, res) => {
  const { name } = req.body;

  try {
    // Check if category already exists (case-insensitive)
    const exists = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (exists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error });
  }
});

// POST: Add a new subcategory to an existing category
router.post('/:id/subcategory', async (req, res) => {
  const { id } = req.params;
  const { subcategory } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if subcategory already exists (case-insensitive)
    const exists = category.subcategories.some(
      (sc) => sc.toLowerCase() === subcategory.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    // Add new subcategory
    category.subcategories.push(subcategory);
    await category.save();

    res.status(201).json({ message: 'Subcategory added', category });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error });
  }
});

// DELETE: Remove a category by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

// DELETE: Remove a subcategory from a specific category
router.delete('/:id/subcategory/:subcat', async (req, res) => {
  const { id, subcat } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Filter out the subcategory to be deleted
    category.subcategories = category.subcategories.filter(
      (sc) => sc.toLowerCase() !== subcat.toLowerCase()
    );

    await category.save();
    res.status(200).json({ message: 'Subcategory deleted successfully', category });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subcategory' });
  }
});

module.exports = router;
