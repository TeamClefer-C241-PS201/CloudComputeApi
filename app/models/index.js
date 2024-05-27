// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
