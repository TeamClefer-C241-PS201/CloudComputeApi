const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limtis: {
        fileSize: 1 * 1024 * 1024, 
    },
});
const { getPredictions } = require('../controllers/predictController.js');

router.post('/predict', upload.single('image'), getPredictions);

module.exports = router;