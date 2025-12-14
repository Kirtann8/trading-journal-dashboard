const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  symbol: {
    type: String,
    required: [true, 'Please add a trading symbol'],
    uppercase: true,
    trim: true
  },
  side: {
    type: String,
    enum: ['buy', 'sell'],
    required: [true, 'Please specify trade side']
  },
  entryPrice: {
    type: Number,
    required: [true, 'Please add entry price'],
    min: [0.000000000001, 'Entry price must be greater than 0']
  },
  exitPrice: {
    type: Number,
    min: [0.000000000001, 'Exit price must be greater than 0']
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [0.000000000001, 'Quantity must be greater than 0']
  },
  date: {
    type: Date,
    required: [true, 'Please add trade date'],
    default: Date.now
  },
  strategyTag: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
tradeSchema.index({ userId: 1, date: -1 });
tradeSchema.index({ userId: 1, symbol: 1 });
tradeSchema.index({ userId: 1, status: 1 });

// Calculate profit/loss before saving
tradeSchema.pre('save', function(next) {
  if (this.exitPrice && this.entryPrice) {
    if (this.side === 'sell') {
      this.profitLoss = (this.entryPrice - this.exitPrice) * this.quantity;
    } else {
      this.profitLoss = (this.exitPrice - this.entryPrice) * this.quantity;
    }
    
    if (this.status === 'open' && this.exitPrice) {
      this.status = 'closed';
    }
  }
  next();
});

// Transform output to exclude sensitive data
tradeSchema.methods.toJSON = function() {
  const trade = this.toObject();
  return trade;
};

module.exports = mongoose.model('Trade', tradeSchema);