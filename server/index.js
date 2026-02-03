require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require('./config/passport')(passport);

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth')); // Keep this for existing frontend calls
app.use('/api/events', require('./routes/events'));
app.use('/api/subscribers', require('./routes/subscribers'));

// Start Scraper (Optional: run initially or on a cron)
const { startScrapingJob } = require('./services/scraper');
startScrapingJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`CORS allowed for: ${process.env.FRONTEND_URL}`);
});
