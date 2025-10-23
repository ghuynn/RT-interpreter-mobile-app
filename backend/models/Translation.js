const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true
  },
  translatedText: {
    type: String,
    required: true
  },
  sourceLanguage: {
    type: String,
    default: 'auto'
  },
  targetLanguage: {
    type: String,
    required: true
  },
  translationMethod: {
    type: String,
    enum: ['voice', 'manual'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'anonymous'
  }
});

module.exports = mongoose.model('Translation', translationSchema);


