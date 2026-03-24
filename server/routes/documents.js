const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Document = require('../models/Document');
const ChatHistory = require('../models/ChatHistory');

// GET /api/documents - Get all documents for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const documents = await Document.find({ userId: req.userId })
        .select('fileName fileType analysis.riskScore analysis.recommendedAction createdAt')
        .sort({ createdAt: -1 });
      return res.json({ documents });
    } else {
      // Mock fetch
      const documents = global.mockStore.documents
        .filter(doc => doc.userId === req.userId)
        .sort((a, b) => b.createdAt - a.createdAt);
      return res.json({ documents });
    }
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/:id - Get a single document with full analysis
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    let document;
    if (mongoose.connection.readyState === 1) {
      document = await Document.findOne({
        _id: req.params.id,
        userId: req.userId
      });
    } else {
      // Mock fetch
      document = global.mockStore.documents.find(doc => 
        (doc._id === req.params.id || doc.id === req.params.id) && doc.userId === req.userId
      );
    }

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Document fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// DELETE /api/documents/:id - Delete a document and its chat history
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const document = await Document.findOneAndDelete({
        _id: req.params.id,
        userId: req.userId
      });

      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Also delete associated chat history
      await ChatHistory.deleteMany({ documentId: req.params.id });
    } else {
      // Mock delete
      const index = global.mockStore.documents.findIndex(doc => 
        (doc._id === req.params.id || doc.id === req.params.id) && doc.userId === req.userId
      );
      if (index === -1) {
        return res.status(404).json({ error: 'Document not found' });
      }
      global.mockStore.documents.splice(index, 1);
      delete global.mockStore.chatHistories[req.params.id];
    }

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document delete error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

module.exports = router;
