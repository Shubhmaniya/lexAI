const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { chatWithDocument } = require('../utils/claudeClient');
const Document = require('../models/Document');
const ChatHistory = require('../models/ChatHistory');

// POST /api/chat - Send follow-up question about a document
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { documentId, message, language } = req.body;

    if (!documentId || !message) {
      return res.status(400).json({ error: 'documentId and message are required' });
    }

    // Get the document
    let document;
    if (mongoose.connection.readyState === 1) {
      document = await Document.findById(documentId);
    } else {
      document = global.mockStore.documents.find(doc => doc._id === documentId || doc.id === documentId);
    }
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Get or create chat history
    let chatHistory;
    if (mongoose.connection.readyState === 1) {
      chatHistory = await ChatHistory.findOne({
        documentId,
        userId: req.userId
      });

      if (!chatHistory) {
        chatHistory = new ChatHistory({
          documentId,
          userId: req.userId,
          messages: []
        });
      }
    } else {
      if (!global.mockStore.chatHistories[documentId]) {
        global.mockStore.chatHistories[documentId] = {
          documentId,
          userId: req.userId,
          messages: []
        };
      }
      chatHistory = global.mockStore.chatHistories[documentId];
    }

    // Add user message
    chatHistory.messages.push({
      role: 'user',
      content: message
    });

    // Build messages array for Claude
    const messages = chatHistory.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get AI response
    let aiResponse;
    try {
      aiResponse = await chatWithDocument(
        document.extractedText,
        messages,
        language || 'en'
      );
    } catch (aiErr) {
      // Setup a mock response for the demo without Claude setup
      aiResponse = "This is a mock AI response since the Claude API key is not configured or the connection failed. Please add your ANTHROPIC_API_KEY to the .env file for the full AI chat experience.\n\nNote: This is AI-generated analysis, not official legal advice. Please consult a qualified lawyer for important legal decisions.";
    }

    // Add AI response to history
    chatHistory.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    if (mongoose.connection.readyState === 1) {
      await chatHistory.save();
    }

    res.json({
      success: true,
      response: aiResponse,
      messageCount: chatHistory.messages.length
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message
    });
  }
});

// GET /api/chat/:documentId - Get chat history for a document
router.get('/:documentId', authMiddleware, async (req, res) => {
  try {
    let chatHistory;
    if (mongoose.connection.readyState === 1) {
      chatHistory = await ChatHistory.findOne({
        documentId: req.params.documentId,
        userId: req.userId
      });
    } else {
      chatHistory = global.mockStore.chatHistories[req.params.documentId];
      if (chatHistory && chatHistory.userId !== req.userId) chatHistory = null;
    }

    res.json({
      messages: chatHistory ? chatHistory.messages : []
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

module.exports = router;
