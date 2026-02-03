const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const sampleEvents = [
    {
        title: "Sydney Lunar Streets – Haymarket street festival",
        date: new Date(2026, 1, 15),
        venueName: "Haymarket",
        city: "Sydney",
        description: "Celebrate the Year of the Horse with a massive street party in Chinatown.",
        sourceName: "City of Sydney",
        originalUrl: "https://whatson.cityofsydney.nsw.gov.au/events/lunar-lanes-haymarket-street-party-1",
        imageUrl: "https://images.unsplash.com/photo-1514525253361-b83a85f0d97a?auto=format&fit=crop&w=800&q=80",
        status: 'new'
    },
    {
        title: "Westpac OpenAir Cinema",
        date: new Date(2026, 1, 20),
        venueName: "Mrs Macquaries Point",
        city: "Sydney",
        description: "The world's most beautiful cinema returns to the harbor.",
        sourceName: "City of Sydney",
        originalUrl: "https://whatson.cityofsydney.nsw.gov.au/events/westpac-openair",
        imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&w=800&q=80",
        status: 'updated'
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Event.deleteMany({});
        await Event.insertMany(sampleEvents);
        console.log('Database seeded!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seed();
