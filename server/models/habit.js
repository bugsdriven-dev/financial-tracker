const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    streak: { type: Number, default: 0 },
    completedDates: { type: [Date], default: [] },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Habit', habitSchema);