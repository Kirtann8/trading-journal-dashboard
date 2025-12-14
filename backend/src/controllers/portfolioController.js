const Trade = require('../models/Trade');

// @desc    Get portfolio summary
// @route   GET /api/portfolio/summary
// @access  Private
const getPortfolioSummary = async (req, res, next) => {
  try {
    const trades = await Trade.find({ userId: req.userId });
    
    const summary = trades.reduce((acc, trade) => {
      const symbol = trade.symbol;
      if (!acc[symbol]) {
        acc[symbol] = { quantity: 0, totalValue: 0, avgPrice: 0 };
      }
      
      if (trade.type === 'buy') {
        acc[symbol].quantity += trade.quantity;
        acc[symbol].totalValue += trade.totalValue;
      } else {
        acc[symbol].quantity -= trade.quantity;
        acc[symbol].totalValue -= trade.totalValue;
      }
      
      acc[symbol].avgPrice = acc[symbol].totalValue / acc[symbol].quantity || 0;
      return acc;
    }, {});

    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
};

// @desc    Get profit/loss analysis
// @route   GET /api/portfolio/pnl
// @access  Private
const getProfitLoss = async (req, res, next) => {
  try {
    const trades = await Trade.find({ userId: req.userId }).sort({ date: 1 });
    
    let totalProfit = 0;
    let totalLoss = 0;
    
    const pnlBySymbol = {};
    
    trades.forEach(trade => {
      if (!pnlBySymbol[trade.symbol]) {
        pnlBySymbol[trade.symbol] = [];
      }
      pnlBySymbol[trade.symbol].push(trade);
    });

    res.json({ success: true, data: { totalProfit, totalLoss, pnlBySymbol } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPortfolioSummary, getProfitLoss };