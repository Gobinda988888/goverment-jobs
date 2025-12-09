// Example: Upload Controller for Job PDFs and Images
const firebaseService = require('../services/firebaseService');
const multer = require('multer');

// Configure multer for memory storage (no disk storage needed)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDFs and images
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and images allowed.'));
    }
  }
});

// Upload PDF notification
exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Firebase Storage
    const publicUrl = await firebaseService.uploadPDF(
      req.file.buffer,
      req.file.originalname
    );

    res.json({
      message: 'PDF uploaded successfully',
      url: publicUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Upload image
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const publicUrl = await firebaseService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({
      message: 'Image uploaded successfully',
      url: publicUrl
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete file
exports.deleteFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ error: 'File URL required' });
    }

    const success = await firebaseService.deleteFile(fileUrl);

    if (success) {
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete file' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export multer middleware
exports.uploadMiddleware = upload;
