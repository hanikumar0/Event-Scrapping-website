require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');

// Initialize Express
const app = express();
app.set('trust proxy', 1);

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
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
require('./config/passport')(passport);

// Routes
app.get('/', (req, res) => res.send('🎟️ SydEvents API is running ✅'));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.use('/auth', require('./routes/auth'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/subscribers', require('./routes/subscribers'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`CORS allowed for: ${process.env.FRONTEND_URL}`);

    // Start Scraper in background after server is up
    const { startScrapingJob } = require('./services/scraper');
    setTimeout(() => {
        console.log('--- INITIALIZING BACKGROUND SCRAPER ---');
        startScrapingJob();
    }, 5000);
});
