const Trade = require('../models/Trade');

// @desc    Recalculate P&L for all trades
// @route   POST /api/trades/recalculate
// @access  Private
const recalculateAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId });
    
    let updated = 0;
    
    for (const trade of trades) {
      if (trade.exitPrice && trade.entryPrice) {
        let profitLoss = 0;
        
        if (trade.side === 'sell') {
          profitLoss = (trade.entryPrice - trade.exitPrice) * trade.quantity;
        } else {
          profitLoss = (trade.exitPrice - trade.entryPrice) * trade.quantity;
        }
        
        trade.profitLoss = profitLoss;
        trade.status = 'closed';
        await trade.save();
        updated++;
      }
    }
    
    res.json({
      success: true,
      message: `Recalculated P&L for ${updated} trades`,
      data: { updated }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error recalculating trades',
      error: error.message
    });
  }
};

module.exports = { recalculateAllTrades };
