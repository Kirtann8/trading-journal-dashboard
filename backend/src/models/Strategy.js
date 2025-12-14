const mongoose = require('mongoose');

const strategySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Please add a strategy name'],
    minlength: [3, 'Strategy name must be at least 3 characters'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
    trim: true
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Med', 'High'],
    required: [true, 'Please specify risk level'],
    default: 'Med'
  },
  winRate: {
    type: Number,
    default: 0,
    min: [0, 'Win rate cannot be negative'],
    max: [100, 'Win rate cannot exceed 100%']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
strategySchema.index({ userId: 1 });
strategySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Strategy', strategySchema);