const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const validateText = require('../middleware/validateText');
const { analyzeDocument } = require('../utils/claudeClient');
const Document = require('../models/Document');

// POST /api/analyze - Analyze document text with Claude
router.post('/', authMiddleware, validateText, async (req, res) => {
  try {
    const { text, fileName, fileType, ocrConfidence, language } = req.body;

    // Call Claude API for analysis
    const analysis = await analyzeDocument(text, language || 'en');

    // Save to database
    const documentData = {
      userId: req.userId,
      fileName: fileName || 'Untitled Document',
      fileType: fileType || 'pdf',
      extractedText: text,
      analysis,
      ocrConfidence: ocrConfidence || null,
      createdAt: new Date()
    };

    let documentId;
    if (mongoose.connection.readyState === 1) {
      const document = new Document(documentData);
      await document.save();
      documentId = document._id;
    } else {
      // Mock save
      documentId = `mock-${Date.now()}`;
      global.mockStore.documents.push({ ...documentData, _id: documentId, id: documentId });
    }

    res.json({
      success: true,
      documentId,
      analysis,
      ocrConfidence: ocrConfidence || null
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze document',
      message: error.message
    });
  }
});

module.exports = router;
