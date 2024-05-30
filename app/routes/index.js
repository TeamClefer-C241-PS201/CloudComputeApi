// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticate.js');
const router = express.Router();
const postController = require('../controllers/discusstionController.js');

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.delete('/:postId/delete', postController.deletePostById);

module.exports = router;
