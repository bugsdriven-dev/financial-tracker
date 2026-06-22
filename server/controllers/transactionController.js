const Transaction = require('../models/transaction');

// Add new transaction
const addTransaction = async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body;
        const transaction = await Transaction.create({
            userId: req.user.id,
            type, amount, category, description, date
        });
        res.status(201).json({ message: 'Transaction added!', transaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all transactions for logged in user
const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id })
            .sort({ date: -1 }); // newest first
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id);
        res.json({ message: 'Transaction deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get summary (total income, total expense, balance)
const getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        res.json({
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addTransaction, getTransactions, deleteTransaction, getSummary };