// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticate');
const router = express.Router();
const postController = require('../controllers/discusstionController.js');
const authController = require('../controllers/authController')

// Development Purpose
router.get('/', (req, res) => {
  res.json({ message: 'Welcome To the Api', user: req.user });
});

router.get('/failure', (req, res) => {
  res.json({ message: 'your login callback fail' });
});
// ----

// No Auth Required
router.post('/register', authController.registerUser);

router.post('/login', authController.login);

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.delete('/:postId/delete', postController.deletePostById);

module.exports = router;
