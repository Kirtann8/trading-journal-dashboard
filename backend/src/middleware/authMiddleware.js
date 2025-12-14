const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Verify JWT token and authenticate user
// @access  Private routes
const verifyToken = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
      }

      // Attach userId to request object
      req.userId = decoded.userId;
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Token verification failed'
        });
      }
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided'
    });
  }
};

module.exports = { verifyToken };