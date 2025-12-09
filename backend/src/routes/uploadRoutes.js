const express = require('express');
const router = express.Router();
const { uploadMiddleware, uploadPDF, uploadImage, deleteFile } = require('../controllers/uploadController');

// Upload routes
router.post('/pdf', uploadMiddleware.single('file'), uploadPDF);
router.post('/image', uploadMiddleware.single('file'), uploadImage);
router.delete('/file', deleteFile);

module.exports = router;
