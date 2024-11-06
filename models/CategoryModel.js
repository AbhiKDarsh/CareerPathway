// CategoryModel.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  subcategories: [
    {
      type: String, // Store subcategory names
      trim: true
    }
  ]
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
