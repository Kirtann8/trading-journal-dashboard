const express = require('express');
const { getTradingStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getTradingStats);

module.exports = router;