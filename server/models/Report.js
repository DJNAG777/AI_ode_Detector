const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    enum: ['single', 'compare', 'batch'],
    required: true
  },
  language: {
    type: String,
    required: true
  },
  aiScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  humanScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  result: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  },
  factors: [{
    name: String,
    description: String,
    score: Number
  }],
  codeSnippet: {
    type: String,
    maxlength: 5000
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema);
