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

//Require Auth

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

//Post
router.post('/posts', ensureAuthenticated,postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId',ensureAuthenticated, postController.getPostById);
router.delete('/:postId/delete',ensureAuthenticated, postController.deletePostById);

//Comments
router.post('/posts/:postId/comments/create',ensureAuthenticated, commentController.createComment);
router.get('/posts/:postId/comments/',ensureAuthenticated, commentController.getCommentById );
router.delete('/:postId/:commentId/delete',ensureAuthenticated, commentController.deleteCommentById );

//Like Posts & Comments
router.post('/posts/:postId/like',ensureAuthenticated, postController.likePost);
router.post('/posts/:postId/:commentId/like',ensureAuthenticated, commentController.likeComment);


module.exports = router;
