const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/fileUpload');
const { extractTextFromPDF } = require('../utils/textExtractor');

// POST /api/upload - Upload and extract text from PDF
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    let extractedText = '';
    let fileType = 'pdf';

    if (file.mimetype === 'application/pdf') {
      // Extract text from PDF
      const result = await extractTextFromPDF(file.buffer);
      extractedText = result.text;
      fileType = 'pdf';
    } else {
      // For images, the OCR is done client-side with Tesseract.js
      // Just return the file info, client will handle OCR
      return res.json({
        success: true,
        fileType: 'image',
        fileName: file.originalname,
        message: 'Image uploaded. OCR will be processed client-side.'
      });
    }

    res.json({
      success: true,
      fileType,
      fileName: file.originalname,
      extractedText,
      textLength: extractedText.length
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }

    res.status(500).json({
      error: 'Failed to process upload',
      message: error.message
    });
  }
});

module.exports = router;
