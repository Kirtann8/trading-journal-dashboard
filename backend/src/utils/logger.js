const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = {
  info: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}\n`;
    console.log(logMessage.trim());
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  },

  error: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}\n`;
    console.error(logMessage.trim());
    fs.appendFileSync(path.join(logDir, 'error.log'), logMessage);
  },

  warn: (message) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}\n`;
    console.warn(logMessage.trim());
    fs.appendFileSync(path.join(logDir, 'app.log'), logMessage);
  }
};

module.exports = logger;