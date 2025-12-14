const User = require('../models/User');
const Trade = require('../models/Trade');

// @desc    Get user profile with basic stats
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get basic trade statistics
    const trades = await Trade.find({ userId: req.userId });
    const totalTrades = trades.length;
    const closedTrades = trades.filter(trade => trade.status === 'closed');
    const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);

    const profileData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      riskPreference: user.profile.riskPreference,
      experienceLevel: user.profile.experienceLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        totalTrades,
        closedTrades: closedTrades.length,
        winRate: Math.round(winRate * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100
      }
    };

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, riskPreference, experienceLevel } = req.body;

    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    if (firstName.trim().length < 1 || lastName.trim().length < 1) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name cannot be empty'
      });
    }

    if (riskPreference && !['Low', 'Med', 'High'].includes(riskPreference)) {
      return res.status(400).json({
        success: false,
        message: 'Risk preference must be Low, Med, or High'
      });
    }

    if (experienceLevel && !['Beginner', 'Intermediate', 'Expert'].includes(experienceLevel)) {
      return res.status(400).json({
        success: false,
        message: 'Experience level must be Beginner, Intermediate, or Expert'
      });
    }

    // Update profile fields
    const updateData = {
      'profile.firstName': firstName.trim(),
      'profile.lastName': lastName.trim()
    };

    if (riskPreference) {
      updateData['profile.riskPreference'] = riskPreference;
    }

    if (experienceLevel) {
      updateData['profile.experienceLevel'] = experienceLevel;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        riskPreference: user.profile.riskPreference,
        experienceLevel: user.profile.experienceLevel,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message
    });
  }
};

// @desc    Get detailed trading statistics
// @route   GET /api/profile/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId }).sort({ date: -1 });

    if (trades.length === 0) {
      return res.json({
        success: true,
        data: {
          totalTrades: 0,
          openTrades: 0,
          closedTrades: 0,
          winRate: 0,
          totalPnL: 0,
          avgRR: 0,
          bestTrade: null,
          worstTrade: null,
          tradesByStrategy: {},
          tradesByMonth: []
        }
      });
    }

    // Basic counts
    const totalTrades = trades.length;
    const openTrades = trades.filter(trade => trade.status === 'open').length;
    const closedTrades = trades.filter(trade => trade.status === 'closed');
    const closedTradesCount = closedTrades.length;

    // Win rate calculation
    const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
    const winRate = closedTradesCount > 0 ? (winningTrades.length / closedTradesCount) * 100 : 0;

    // Total P&L
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);

    // Average Risk:Reward ratio (simplified calculation)
    const avgRR = closedTrades.length > 0 ? 
      closedTrades.reduce((sum, trade) => {
        const rr = trade.profitLoss > 0 ? Math.abs(trade.profitLoss / trade.entryPrice) : 0;
        return sum + rr;
      }, 0) / closedTrades.length : 0;

    // Best and worst trades
    const tradesWithPnL = closedTrades.filter(trade => trade.profitLoss !== 0);
    const bestTrade = tradesWithPnL.length > 0 ? 
      tradesWithPnL.reduce((best, trade) => trade.profitLoss > best.profitLoss ? trade : best) : null;
    const worstTrade = tradesWithPnL.length > 0 ? 
      tradesWithPnL.reduce((worst, trade) => trade.profitLoss < worst.profitLoss ? trade : worst) : null;

    // Trades by strategy
    const tradesByStrategy = trades.reduce((acc, trade) => {
      const strategy = trade.strategyTag || 'No Strategy';
      if (!acc[strategy]) {
        acc[strategy] = { count: 0, pnl: 0 };
      }
      acc[strategy].count++;
      acc[strategy].pnl += trade.profitLoss || 0;
      return acc;
    }, {});

    // Trades by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentTrades = trades.filter(trade => new Date(trade.date) >= sixMonthsAgo);
    const tradesByMonth = {};
    
    recentTrades.forEach(trade => {
      const monthKey = new Date(trade.date).toISOString().slice(0, 7); // YYYY-MM format
      if (!tradesByMonth[monthKey]) {
        tradesByMonth[monthKey] = { count: 0, pnl: 0 };
      }
      tradesByMonth[monthKey].count++;
      tradesByMonth[monthKey].pnl += trade.profitLoss || 0;
    });

    // Convert to array and sort by month
    const monthlyData = Object.entries(tradesByMonth)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const statsData = {
      totalTrades,
      openTrades,
      closedTrades: closedTradesCount,
      winRate: Math.round(winRate * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      avgRR: Math.round(avgRR * 10000) / 10000,
      bestTrade: bestTrade ? {
        _id: bestTrade._id,
        symbol: bestTrade.symbol,
        profitLoss: Math.round(bestTrade.profitLoss * 100) / 100,
        date: bestTrade.date
      } : null,
      worstTrade: worstTrade ? {
        _id: worstTrade._id,
        symbol: worstTrade.symbol,
        profitLoss: Math.round(worstTrade.profitLoss * 100) / 100,
        date: worstTrade.date
      } : null,
      tradesByStrategy: Object.entries(tradesByStrategy).map(([strategy, data]) => ({
        strategy,
        count: data.count,
        pnl: Math.round(data.pnl * 100) / 100
      })),
      tradesByMonth: monthlyData.map(item => ({
        ...item,
        pnl: Math.round(item.pnl * 100) / 100
      }))
    };

    res.json({
      success: true,
      data: statsData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: error.message
    });
  }
};

module.exports = { getProfile, updateProfile, getStats };