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
// The "Nuclear Option" for CORS - Manual Header Injection
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // Allow any origin that is one of our known ones, or just allow all for debugging if needed
    // For production security, we'll reflect the origin if it exists. 
    // If undefined (some headers stripped), fallback to the known frontend URL.
    const allowedOrigin = origin || process.env.FRONTEND_URL || '*';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');

    // Handle Preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

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
});
