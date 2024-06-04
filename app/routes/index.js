// routes/index.js
const express = require('express');
const ensureAuthenticated = require('../middleware/ensureAuthenticate.js');
const router = express.Router();
const postController = require('../controllers/discusstionController.js');
// const postPredict = require('../controllers/predictController.js');

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.post('/posts', postController.createPost);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:postId', postController.getPostById);
router.delete('/:postId/delete', postController.deletePostById);

// router.post('/predict', postPredict.getPredictions);

// router.post('/predict', async (req, res) => {
//   const { image } = req.body; // Assuming the image is sent in the body. Adjust this as per your requirement.
//   const { model } = req.app.locals; // Assuming the model is stored in app locals.

//   try {
//       const { label, suggestion } = await predictClassification(model, image);
//       const id = crypto.randomUUID();
//       const createdAt = new Date().toISOString();

//       const data = {
//           id,
//           result: label,
//           suggestion,
//           createdAt
//       };

//       // // Store data in Firestore
//       // await db.collection('prediction').doc(id).set(data);

//       res.status(201).json({
//           status: 'success',
//           message: 'Model is predicted successfully',
//           data
//       });
//   } catch (error) {
//       res.status(500).json({
//           status: 'error',
//           message: error.message
//       });
//   }
// });

module.exports = router;
