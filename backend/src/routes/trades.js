const express = require('express');
const {
  createTrade,
  getTrades,
  getTradeById,
  updateTrade,
  deleteTrade
} = require('../controllers/tradeController');
const { recalculateAllTrades } = require('../controllers/utilityController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Utility route
router.post('/recalculate', recalculateAllTrades);

// Trade routes
router.route('/')
  .get(getTrades)
  .post(createTrade);

router.route('/:id')
  .get(getTradeById)
  .put(updateTrade)
  .delete(deleteTrade);

module.exports = router;