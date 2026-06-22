const User = require('../models/user');
const Transaction = require('../models/transaction');
const Habit = require('../models/habit');
const Goal = require('../models/goal');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get platform-wide stats (admin only)
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTransactions = await Transaction.countDocuments();
        const totalHabits = await Habit.countDocuments();
        const totalGoals = await Goal.countDocuments();

        // Count users created in last 7 days (active/new users)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Total money flowing through the platform
        const allTransactions = await Transaction.find();
        const totalIncomeAcrossPlatform = allTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenseAcrossPlatform = allTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        res.json({
            totalUsers,
            newUsersThisWeek,
            totalTransactions,
            totalHabits,
            totalGoals,
            totalIncomeAcrossPlatform,
            totalExpenseAcrossPlatform
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a user (admin only)
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, getStats, deleteUser };