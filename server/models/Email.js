const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: String,
  from: String,
  date: { type: Date, unique: true, index: true }, // Ensure uniqueness
  read: { type: Boolean, default: false },         // New field for read/unread status
});

module.exports = mongoose.model('Email', emailSchema);
