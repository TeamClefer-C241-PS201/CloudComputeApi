// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();



router.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failure' }), authController.googleCallback);
router.get('/logout', authController.logout);
router.post('/register', authController.registerUser);
router.post('/login', authController.login);

module.exports = router;

