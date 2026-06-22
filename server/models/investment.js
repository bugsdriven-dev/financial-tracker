const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Investment', investmentSchema);