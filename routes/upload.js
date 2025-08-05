// backend/routes/upload.js
const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// --- Multer Storage Configuration ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads/' directory
  },
  filename(req, file, cb) {
    // Create a unique filename
    cb(null, `image-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// --- File Type Check ---
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpg|jpeg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // Pass a proper Error object to the callback
    cb(new Error('Images Only! Please upload a valid image file.'));
  }
}

// --- Initialize Multer Upload Middleware ---
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// --- The API Route ---
// @route   POST /api/upload
// @desc    Upload an image file
router.post('/', (req, res) => {
  // Use a middleware function to handle the upload and any errors
  upload.single('image')(req, res, function (err) {
    if (err) {
      // This will catch errors from checkFileType and other multer errors
      // It sends a clean error message back to the frontend instead of crashing
      return res.status(400).json({ message: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }
    
    // Send back the path where the file was saved
    res.status(201).send({
      message: 'Image Uploaded Successfully',
      image: `/${req.file.path.replace(/\\/g, "/")}`,
    });
  });
});

module.exports = router;
