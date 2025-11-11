const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// List + Search
router.get('/', async (req, res) => {
  const query = { owner: req.session.userId };
  if (req.query.name) query.name = new RegExp(req.query.name, 'i');
  if (req.query.isPG !== undefined) query.isPG = req.query.isPG === 'true';
  if (req.query.minGPA) query.gpa = { $gte: Number(req.query.minGPA) };

  const students = await Student.find(query).sort({ studentId: 1 });
  res.render('students/index', { students, search: req.query });
});

// New
router.get('/new', (req, res) => res.render('students/new'));

router.post('/', async (req, res) => {
  const { studentId, name, gpa, isPG } = req.body;
  const email = `${name.replace(/\s+/g, '').toLowerCase()}@college.com`;
  await Student.create({
    studentId: Number(studentId),
    name,
    email,
    gpa: Number(gpa),
    isPG: isPG === 'yes',
    owner: req.session.userId,
  });
  res.redirect('/students');
});

// Edit
router.get('/:id/edit', async (req, res) => {
  const student = await Student.findOne({ _id: req.params.id, owner: req.session.userId });
  if (!student) return res.redirect('/students');
  res.render('students/edit', { student });
});

router.put('/:id', async (req, res) => {
  await Student.findOneAndUpdate(
    { _id: req.params.id, owner: req.session.userId },
    { gpa: Number(req.body.gpa), isPG: req.body.isPG === 'yes' }
  );
  res.redirect('/students');
});

// Delete
router.delete('/:id', async (req, res) => {
  await Student.findOneAndDelete({ _id: req.params.id, owner: req.session.userId });
  res.redirect('/students');
});

module.exports = router;