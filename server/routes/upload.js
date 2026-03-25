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
    } else if (file.mimetype === 'text/plain') {
      // Extract text from plain text file
      extractedText = file.buffer.toString('utf8');
      fileType = 'txt';
    } else if (file.mimetype.startsWith('image/')) {
      // For images, the OCR is done client-side with Tesseract.js (to save server resources)
      return res.json({
        success: true,
        fileType: 'image',
        fileName: file.originalname,
        message: 'Image detected. OCR will be processed.'
      });
    } else {
      // For Word docs and other allowed but non-extractable types, we allow it to pass through
      // with empty text so the user can still chat or use the fallback flow.
      extractedText = '';
      fileType = file.originalname.split('.').pop() || 'unknown';
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
