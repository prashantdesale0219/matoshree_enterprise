const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
require('dotenv').config();

// Initialize app
const app = express();

// Request Logger
app.use((req, res, next) => {
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/\/+/g, '/');
  }
  console.log(`${req.method} ${req.url}`);
  next();
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in production for now to fix the issue, then restrict
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Manual OPTIONS handler for Preflight (Express 5 syntax)
app.options('/*path', cors());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, // Production me CSP issue kar sakta hai
}));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Matoshree Enterprise API is running...' });
});

// Health check route for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
