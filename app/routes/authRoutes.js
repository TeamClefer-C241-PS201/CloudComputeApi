// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();
const multer = require('multer');
const ensureAuthenticate = require('../middleware/ensureAuthenticate');
const upload = multer({ storage: multer.memoryStorage() });

//authentication routes
router.post('/auth/google/android', authController.googleSignInAndroid);
router.get('/auth/google', passport.authenticate('google', { scope: ['email','profile'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failure' }), authController.googleCallback);
router.get('/logout', authController.logout);

//user routes
router.post('/register', upload.none(), authController.registerUser);
router.post('/login', upload.none(), authController.login);
router.put('/users', ensureAuthenticate,authController.edit);
router.get('/userdata',ensureAuthenticate, authController.getUser)

module.exports = router;

