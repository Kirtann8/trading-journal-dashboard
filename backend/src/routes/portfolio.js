const express = require('express');
const { getPortfolioSummary, getProfitLoss } = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/summary', getPortfolioSummary);
router.get('/pnl', getProfitLoss);

module.exports = router;