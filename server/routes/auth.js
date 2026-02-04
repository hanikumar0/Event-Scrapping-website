const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Auth with Google
// @route GET /api/auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
}));

// @desc Google auth callback
// @route GET /api/auth/google/callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

// @desc Logout user
// @route GET /api/auth/logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
            if (err) console.error('Error destroying session:', err);
            res.clearCookie('sydevents.sid', {
                path: '/',
                secure: true,
                sameSite: 'none',
                httpOnly: true
            });
            res.redirect(process.env.FRONTEND_URL);
        });
    });
});

// @desc Get current user
// @route GET /api/auth/me
router.get('/me', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).json({ msg: 'Not authorized' });
    }
});


module.exports = router;
