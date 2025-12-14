# Crypto Trading Journal Backend

Express.js backend API for a crypto trading journal dashboard with MongoDB and JWT authentication.

## Features

- User authentication (register, login, JWT tokens)
- CRUD operations for trading records
- MongoDB integration with Mongoose
- Security middleware (Helmet, CORS)
- Error handling middleware
- Input validation

## Tech Stack

- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Helmet for security headers
- CORS for cross-origin requests

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Trades
- `GET /api/trades` - Get all user trades (protected)
- `POST /api/trades` - Create new trade (protected)
- `GET /api/trades/:id` - Get single trade (protected)
- `PUT /api/trades/:id` - Update trade (protected)
- `DELETE /api/trades/:id` - Delete trade (protected)

### Health Check
- `GET /api/health` - API health status

## Project Structure

```
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── tradeController.js   # Trade CRUD operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Trade.js             # Trade schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   └── trades.js            # Trade routes
│   └── utils/
│       └── generateToken.js     # JWT token generation
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── server.js                    # Application entry point
```