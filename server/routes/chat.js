const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { chatWithDocument, streamChatWithDocument } = require('../utils/claudeClient');
const Document = require('../models/Document');
const ChatHistory = require('../models/ChatHistory');

// POST /api/chat/stream - Stream AI response via SSE
router.post('/stream', authMiddleware, async (req, res) => {
  try {
    const { documentId, message, language } = req.body;

    if (!documentId || !message) {
      return res.status(400).json({ error: 'documentId and message are required' });
    }

    // Try to get the document (allow missing — user can still chat)
    let documentText = '';
    let document = null;
    if (mongoose.connection.readyState === 1) {
      try { document = await Document.findById(documentId); } catch(e) {}
    } else {
      document = global.mockStore.documents.find(doc => doc._id === documentId || doc.id === documentId);
    }
    
    if (document) {
      documentText = document.extractedText || '';
    }

    // Get or create chat history
    let chatHistory;
    if (mongoose.connection.readyState === 1) {
      chatHistory = await ChatHistory.findOne({ documentId, userId: req.userId });
      if (!chatHistory) {
        chatHistory = new ChatHistory({ documentId, userId: req.userId, messages: [] });
      }
    } else {
      if (!global.mockStore.chatHistories[documentId]) {
        global.mockStore.chatHistories[documentId] = { documentId, userId: req.userId, messages: [] };
      }
      chatHistory = global.mockStore.chatHistories[documentId];
    }

    // Add user message
    chatHistory.messages.push({ role: 'user', content: message });

    // Build messages for Claude
    const msgs = chatHistory.messages.map(msg => ({ role: msg.role, content: msg.content }));

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    let fullResponse = '';
    try {
      fullResponse = await streamChatWithDocument(
        documentText,
        msgs,
        language || 'en',
        (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
      );
    } catch (aiErr) {
      console.error('AI streaming error (falling back to mock):', aiErr.message);
      
      // Smart mock that responds to the user's actual question
      const mockResponses = {
        default: `I understand you're asking about "${message}". As your AI legal assistant, I'd be happy to help analyze this. However, my AI capabilities are currently running in demo mode because the API key hasn't been configured yet.\n\nTo enable full AI responses:\n1. Get an API key from Anthropic (https://console.anthropic.com)\n2. Add it to your server/.env file as ANTHROPIC_API_KEY=your_key_here\n3. Restart the server\n\nOnce configured, I'll be able to provide detailed legal analysis, answer your questions about uploaded documents, and help you understand complex legal terms.\n\nNote: This is AI-generated analysis, not official legal advice. Please consult a qualified lawyer for important legal decisions.`,
      };

      fullResponse = mockResponses.default;
      
      // Stream word-by-word for a realistic typing effect
      const words = fullResponse.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        await new Promise(r => setTimeout(r, 30)); // 30ms per word
      }
    }

    // Save assistant response
    chatHistory.messages.push({ role: 'assistant', content: fullResponse });
    if (mongoose.connection.readyState === 1) {
      await chatHistory.save();
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream chat', message: error.message });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.end();
    }
  }
});

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
