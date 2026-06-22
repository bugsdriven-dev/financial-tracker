const Investment = require('../models/investment');

// Add investment
const addInvestment = async (req, res) => {
    try {
        const { type, amount, description, date } = req.body;
        const investment = await Investment.create({
            userId: req.user.id,
            type, amount, description, date
        });
        res.status(201).json({ message: 'Investment added!', investment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all investments
const getInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ userId: req.user.id })
            .sort({ date: -1 });
        res.json(investments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete investment
const deleteInvestment = async (req, res) => {
    try {
        await Investment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Investment deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addInvestment, getInvestments, deleteInvestment };