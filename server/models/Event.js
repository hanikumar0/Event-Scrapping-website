const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date },
  time: { type: String },
  venueName: { type: String },
  address: { type: String },
  city: { type: String, default: 'Sydney' },
  description: { type: String },
  category: [String],
  imageUrl: { type: String },
  sourceName: { type: String },
  originalUrl: { type: String, unique: true },
  lastScrapedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['new', 'updated', 'inactive', 'imported'], 
    default: 'new' 
  },
  importedAt: { type: Date },
  importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  importNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
