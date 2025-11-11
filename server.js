require('dotenv').config();
const express = require('express');
const session = require('cookie-session');
const methodOverride = require('method-override');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middleware
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use(session({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'fallback-secret-key-123'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: false, // set true only in HTTPS
  httpOnly: true,
  sameSite: 'lax'
}));

// Auth Middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) return next();
  res.redirect('/login');
};

// Home Route
app.get('/', (req, res) => {
  req.session.userId ? res.redirect('/students') : res.redirect('/login');
});

// Home Page - Redirect to Login or Dashboard
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/students');
  } else {
    res.redirect('/login');
  }
});


app.use('/', require('./routes/auth'));

app.use('/students', requireAuth, require('./routes/students'));
app.use('/api/students', require('./routes/api'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
