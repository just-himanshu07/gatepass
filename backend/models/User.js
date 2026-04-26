const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'guard'], default: 'student' },
  rollNumber: { type: String },
  phone: { type: String },
  parentPhone: { type: String },
  hostel: { type: String },
  roomNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
