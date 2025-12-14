// Import all models to ensure they're registered with Mongoose
const User = require('./User');
const Trade = require('./Trade');
const Strategy = require('./Strategy');
const Portfolio = require('./Portfolio');

module.exports = {
  User,
  Trade,
  Strategy,
  Portfolio
};