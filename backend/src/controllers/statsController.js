const Trade = require('../models/Trade');

// @desc    Get trading statistics
// @route   GET /api/stats
// @access  Private
const getTradingStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const totalTrades = await Trade.countDocuments({ user: userId });
    const buyTrades = await Trade.countDocuments({ user: userId, type: 'buy' });
    const sellTrades = await Trade.countDocuments({ user: userId, type: 'sell' });
    
    const trades = await Trade.find({ user: userId });
    
    const totalVolume = trades.reduce((sum, trade) => sum + trade.totalValue, 0);
    const totalFees = trades.reduce((sum, trade) => sum + trade.fees, 0);
    
    const uniqueSymbols = [...new Set(trades.map(trade => trade.symbol))];
    
    const monthlyStats = await Trade.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: '$tradeDate' },
            month: { $month: '$tradeDate' }
          },
          count: { $sum: 1 },
          volume: { $sum: '$totalValue' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      data: {
        totalTrades,
        buyTrades,
        sellTrades,
        totalVolume,
        totalFees,
        uniqueSymbols: uniqueSymbols.length,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTradingStats };