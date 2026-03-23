const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  analysis: {
    summary: String,
    riskScore: Number,
    recommendedAction: {
      type: String,
      enum: ['SAFE', 'NEGOTIATE', 'AVOID']
    },
    clausesAgainstUser: [String],
    clausesForUser: [String],
    loopholes: [String],
    missingProtections: [String],
    summary_hindi: String
  },
  ocrConfidence: {
    type: Number,
    default: null
  },
  cloudinaryUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
