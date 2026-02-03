const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Subscriber = require('../models/Subscriber');

// @desc Get analytics stats
// @route GET /api/events/stats
router.get('/stats', async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();
        const newEvents = await Event.countDocuments({ status: 'new' });
        const importedEvents = await Event.countDocuments({ status: 'imported' });
        const totalLeads = await Subscriber.countDocuments();

        // Count events scraped in last 24h
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentlyScraped = await Event.countDocuments({ lastScrapedAt: { $gte: last24h } });

        res.json({
            totalEvents,
            recentlyScraped,
            newEvents,
            importedEvents,
            totalLeads
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});
// @desc Get all events
// @route GET /api/events
router.get('/', async (req, res) => {
    try {
        const { city, search, dateStart, dateEnd, status } = req.query;
        let query = {};

        if (city) query.city = city;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { venueName: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        if (dateStart || dateEnd) {
            query.date = {};
            if (dateStart) query.date.$gte = new Date(dateStart);
            if (dateEnd) query.date.$lte = new Date(dateEnd);
        }

        const events = await Event.find(query).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @desc Get single event
// @route GET /api/events/:id
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @desc Update event status (Import)
// @route PATCH /api/events/:id/import
router.patch('/:id/import', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ msg: 'Not authorized' });

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        event.status = 'imported';
        event.importedAt = new Date();
        event.importedBy = req.user._id;
        event.importNotes = req.body.notes || '';

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
