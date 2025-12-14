const express = require('express');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;