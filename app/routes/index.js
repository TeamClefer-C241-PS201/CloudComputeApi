// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticate');
const router = express.Router();
const authController = require('../controllers/authController')

// Development Purpose
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.get('/failure', (req, res) => {
  res.json({ message: 'your login callback fail' });
});
// ----

// No Auth Required
router.post('/register', authController.registerUser);

router.get('/login', (req, res) => {
  const message = req.query.message || '';
  res.json({ message: 'login' });
});

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
