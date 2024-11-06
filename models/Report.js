// models/Report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',  // Assumes a Blog model exists
    required: true,
  },
  reason: {
    type: String,
    required: true,
    enum: ['Violence Content', 'False Information', 'Nudity or Sexual Content', 'Promoting Unwanted Content', 'I Just Don’t Like the Post'],
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assumes a User model exists
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
