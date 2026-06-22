const Habit = require('../models/habit');

// Add new habit
const addHabit = async (req, res) => {
    try {
        const { name, frequency } = req.body;
        const habit = await Habit.create({
            userId: req.user.id,
            name, frequency
        });
        res.status(201).json({ message: 'Habit added!', habit });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all habits
const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id, isActive: true });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark habit as complete today
const completeHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        const today = new Date().toDateString();

        // Check if already completed today
        const alreadyDone = habit.completedDates
            .some(d => new Date(d).toDateString() === today);

        if (alreadyDone) {
            return res.status(400).json({ message: 'Already completed today!' });
        }

        habit.completedDates.push(new Date());
        habit.streak += 1;
        await habit.save();

        res.json({ message: 'Habit completed! 🔥', streak: habit.streak });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete habit
const deleteHabit = async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Habit deleted!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addHabit, getHabits, completeHabit, deleteHabit };