const validator = require('validator');

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateTrade = (req, res, next) => {
  const { symbol, type, quantity, price, exchange } = req.body;
  const errors = [];

  if (!symbol || symbol.trim().length < 1) {
    errors.push('Symbol is required');
  }

  if (!type || !['buy', 'sell'].includes(type)) {
    errors.push('Type must be buy or sell');
  }

  if (!quantity || quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (!price || price <= 0) {
    errors.push('Price must be greater than 0');
  }

  if (!exchange || exchange.trim().length < 1) {
    errors.push('Exchange is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateTrade };