const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: String,
  from: String,
  date: { type: Date, unique: true, index: true }, // Ensure uniqueness
});

module.exports = mongoose.model('Email', emailSchema);
