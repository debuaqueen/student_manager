const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/students
router.get('/', async (req, res) => {
  const students = await Student.find().select('-owner');
  res.json(students);
});

// POST /api/students
router.post('/', async (req, res) => {
  const { studentId, name, gpa, isPG } = req.body;
  const email = `${name.replace(/\s+/g, '').toLowerCase()}@college.com`;
  const student = await Student.create({
    studentId,
    name,
    email,
    gpa,
    isPG: !!isPG,
    owner: null,
  });
  res.status(201).json(student);
});

// PUT /api/students/:id
router.put('/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json(student);
});

// DELETE /api/students/:id
router.delete('/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;