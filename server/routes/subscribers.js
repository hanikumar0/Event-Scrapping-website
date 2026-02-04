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
            console.log(`Event found: ${event.title}. Sending email to ${email}...`);
            // Wait for email to ensure we don't lie to the user
            const emailSent = await sendTicketEmail(email, event);
            if (emailSent) {
                console.log('Email sent successfully');
                return res.json({ msg: 'Ticket sent! Check your inbox (and spam folder).' });
            } else {
                console.error('Email service returned failure');
                return res.status(500).json({ msg: 'We saved your request, but the email service timed out. Please check back later or try again.' });
            }
        } else {
            console.error(`Event NOT found for ID: ${eventId}`);
            return res.status(404).json({ msg: 'Event not found' });
        }
    } catch (err) {
        console.error('Subscribers Error:', err);
        res.status(500).json({ msg: 'Server error during processing' });
    }
});

module.exports = router;
