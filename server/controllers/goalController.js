const Goal = require('../models/goal');

// Add new goal
const addGoal = async (req, res) => {
    try {
        const { name, targetAmount, deadline } = req.body;
        const goal = await Goal.create({
            userId: req.user.id,
            name, targetAmount, deadline
        });
        res.status(201).json({ message: 'Goal added!', goal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all goals
const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add money to a goal
const updateGoalSavings = async (req, res) => {
    try {
        const { amount } = req.body;
        const goal = await Goal.findById(req.params.id);

        goal.savedAmount += amount;
        if (goal.savedAmount >= goal.targetAmount) {
            goal.isCompleted = true;
        }
        await goal.save();

        res.json({ message: 'Goal updated!', goal });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete goal
const deleteGoal = async (req, res) => {
    try {
        await Goal.findByIdAndDelete(req.params.id);
        res.json({ message: 'Goal deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addGoal, getGoals, updateGoalSavings, deleteGoal };