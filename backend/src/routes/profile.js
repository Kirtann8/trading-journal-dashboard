const express = require('express');
const { getProfile, updateProfile, getStats } = require('../controllers/profileController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Profile routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/stats', getStats);

module.exports = router;