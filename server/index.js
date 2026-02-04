require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// Initialize Express
const app = express();
app.set('trust proxy', 1);

// Connect Database
connectDB();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://event-scrapping-website.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000'
        ].filter(Boolean).map(url => url.replace(/\/$/, ''));

        const normalizedOrigin = origin?.replace(/\/$/, '');

        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.log(`CORS Blocked: ${origin}`);
            // Pass false instead of an Error to allow the request to fail gracefully
            // with headers, rather than triggering a generic network error.
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());

// Session Configuration with MongoDB Store
app.use(session({
    secret: process.env.SESSION_SECRET || 'syd_events_secret_12345',
    resave: false,
    saveUninitialized: false,
    store: (MongoStore.create || MongoStore.default.create)({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 24 * 60 * 60 // 1 day
    }),
    proxy: true,
    name: 'sydevents.sid',
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
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
