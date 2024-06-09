// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticate');
const router = express.Router();
const postController = require('../controllers/discusstionController.js');
const authController = require('../controllers/authController');
const commentController = require('../controllers/commentController.js');

// Development Purpose
router.get('/', (req, res) => {
  res.json({ message: 'Welcome To the Api', user: req.user});
});

router.get('/failure', (req, res) => {
  res.json({ message: 'your login callback fail' });
});
// ----

// No Auth Required

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

//Post
router.post('/posts', postController.createPost);
router.get('/posts', ensureAuthenticated, postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);
router.delete('/:postId/delete', postController.deletePostById);

//Comments
router.post('/posts/:postId/comments/create', commentController.createComment);
router.get('/posts/:postId/comments/', commentController.getCommentById );
router.delete('/:postId/:commentId/delete', commentController.deleteCommentById );

//Like Posts & Comments
router.post('/posts/:postId/like', postController.likePost);
router.post('/posts/:postId/:commentId/like', commentController.likeComment);
router.delete('/posts/:postId/:commentId/like', commentController.unlikeComment);
module.exports = router;
