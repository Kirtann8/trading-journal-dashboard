const User = require('../models/User');
const Trade = require('../models/Trade');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Validate password strength
const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasNumber) {
    return 'Password must contain at least one number';
  }
  return null;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, username, profile } = req.body;

    // Validation
    if (!email || !password || !username || !profile?.firstName || !profile?.lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: email, password, username, firstName, lastName'
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    // Validate username
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email.toLowerCase() ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      username,
      profile
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      riskPreference: user.profile.riskPreference,
      experienceLevel: user.profile.experienceLevel,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      riskPreference: user.profile.riskPreference,
      experienceLevel: user.profile.experienceLevel,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

// @desc    Get current user profile with statistics
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    // Get user from req.userId (set by auth middleware)
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const trades = await Trade.find({ userId: req.userId });
    const totalTrades = trades.length;
    
    // Calculate win rate
    const closedTrades = trades.filter(trade => trade.status === 'closed');
    const winningTrades = closedTrades.filter(trade => trade.profitLoss > 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    // Calculate total P&L
    const totalPnL = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);

    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      riskPreference: user.profile.riskPreference,
      experienceLevel: user.profile.experienceLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      statistics: {
        totalTrades,
        winRate: Math.round(winRate * 100) / 100,
        totalPnL: Math.round(totalPnL * 100) / 100
      }
    };

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
      error: error.message
    });
  }
};

module.exports = { register, login, logout, getCurrentUser };