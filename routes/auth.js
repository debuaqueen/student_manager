const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    await User.create({ email, password });
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'Email already exists' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.comparePassword(password)) {
    req.session.userId = user._id;
    res.redirect('/students');
  } else {
    res.render('login', { error: 'Invalid email or password' });
  }
});

router.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

module.exports = router;