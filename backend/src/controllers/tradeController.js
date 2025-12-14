const Trade = require('../models/Trade');
const mongoose = require('mongoose');

// @desc    Create new trade
// @route   POST /api/trades
// @access  Private
const createTrade = async (req, res) => {
  try {
    const { symbol, side, entryPrice, exitPrice, quantity, date, strategyTag, notes } = req.body;

    // Validation
    if (!symbol || !side || !entryPrice || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide symbol, side, entryPrice, and quantity'
      });
    }

    if (!['buy', 'sell'].includes(side)) {
      return res.status(400).json({
        success: false,
        message: 'Side must be either buy or sell'
      });
    }

    // Validate numeric fields > 0
    if (entryPrice <= 0 || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Entry price and quantity must be greater than 0'
      });
    }

    if (exitPrice && exitPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Exit price must be greater than 0'
      });
    }

    const tradeData = {
      userId: req.userId,
      symbol: symbol.toUpperCase(),
      side,
      entryPrice,
      exitPrice: exitPrice || undefined,
      quantity,
      date: date || new Date(),
      strategyTag: strategyTag || undefined,
      notes: notes || undefined
    };

    const trade = await Trade.create(tradeData);

    res.status(201).json({
      success: true,
      message: 'Trade created successfully',
      data: trade
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating trade',
      error: error.message
    });
  }
};

// @desc    Get all trades with filters and pagination
// @route   GET /api/trades
// @access  Private
const getTrades = async (req, res) => {
  try {
    const {
      symbol,
      side,
      startDate,
      endDate,
      strategy,
      status,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = { userId: req.userId };

    if (symbol) {
      filter.symbol = symbol.toUpperCase();
    }

    if (side) {
      filter.side = side;
    }

    if (status) {
      filter.status = status;
    }

    if (strategy) {
      filter.strategyTag = strategy;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate);
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [trades, totalCount] = await Promise.all([
      Trade.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum),
      Trade.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        trades,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching trades',
      error: error.message
    });
  }
};

// @desc    Get single trade by ID
// @route   GET /api/trades/:id
// @access  Private
const getTradeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trade ID'
      });
    }

    const trade = await Trade.findOne({ _id: id, userId: req.userId });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    res.json({
      success: true,
      data: trade
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching trade',
      error: error.message
    });
  }
};

// @desc    Update trade
// @route   PUT /api/trades/:id
// @access  Private
const updateTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { symbol, side, entryPrice, exitPrice, quantity, date, strategyTag, notes, status } = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trade ID'
      });
    }

    const trade = await Trade.findOne({ _id: id, userId: req.userId });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    // Find existing trade
    // Update fields
    if (symbol) trade.symbol = symbol.toUpperCase();
    if (side) trade.side = side;
    if (entryPrice) trade.entryPrice = entryPrice;
    if (exitPrice !== undefined) trade.exitPrice = exitPrice;
    if (quantity) trade.quantity = quantity;
    if (date) trade.date = date;
    if (strategyTag !== undefined) trade.strategyTag = strategyTag;
    if (notes !== undefined) trade.notes = notes;
    if (status) trade.status = status;

    // If status is manually set to open, clear exit price and pnl
    if (status === 'open') {
      trade.exitPrice = undefined;
      trade.profitLoss = 0;
    }

    await trade.save();

    res.json({
      success: true,
      message: 'Trade updated successfully',
      data: trade
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating trade',
      error: error.message
    });
  }
};

// @desc    Delete trade
// @route   DELETE /api/trades/:id
// @access  Private
const deleteTrade = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid trade ID'
      });
    }

    const trade = await Trade.findOneAndDelete({ _id: id, userId: req.userId });

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    res.status(204).json();

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting trade',
      error: error.message
    });
  }
};

module.exports = { createTrade, getTrades, getTradeById, updateTrade, deleteTrade };