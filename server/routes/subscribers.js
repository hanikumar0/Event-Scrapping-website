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
            console.log(`Event found: ${event.title}. Queuing email to ${email}...`);
            // Fire and forget email for better user experience (site speed)
            sendTicketEmail(email, event).then(sent => {
                if (sent) console.log(`Email eventually sent to ${email}`);
                else console.error(`Email background task failed for ${email}`);
            }).catch(e => console.error('Email Queuing Error:', e));
        } else {
            console.error(`Event NOT found for ID: ${eventId}`);
        }

        res.json({ msg: 'Ticket request received! Check your inbox soon.' });
    } catch (err) {
        console.error('Subscribers Error:', err);
        res.status(500).json({ msg: 'Server error during processing' });
    }
});

module.exports = router;
