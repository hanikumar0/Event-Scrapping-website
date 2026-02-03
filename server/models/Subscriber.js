const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    consent: { type: Boolean, default: false },
    eventRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    subscribedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
