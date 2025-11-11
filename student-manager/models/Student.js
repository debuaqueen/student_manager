const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gpa: { type: Number, required: true },
  isPG: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Student', studentSchema);