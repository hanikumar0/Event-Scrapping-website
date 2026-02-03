const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

const Event = require('../models/Event');
const { sendTicketEmail } = require('../services/email');

// @desc Add new subscriber
// @route POST /api/subscribers
router.post('/', async (req, res) => {
    const { email, consent, eventId } = req.body;
    console.log('--- TICKETING REQUEST ---');

    if (!email || !consent || !eventId) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
        // 1. Save subscriber to database
        const newSubscriber = new Subscriber({
            email,
            consent,
            eventRef: eventId
        });
        await newSubscriber.save();

        // 2. Fetch event details for the email
        const event = await Event.findById(eventId);
        if (event) {
            // 3. Trigger email sending
            await sendTicketEmail(email, event);
        }

        res.json({ msg: 'Subscription successful and email sent!' });
    } catch (err) {
        console.error('Subscribers Error:', err);
        res.status(500).json({ msg: 'Server error during processing' });
    }
});

module.exports = router;
