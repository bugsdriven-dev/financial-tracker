const express = require('express');
const router = express.Router();
const { addGoal, getGoals, updateGoalSavings, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addGoal);
router.get('/', getGoals);
router.put('/:id/save', updateGoalSavings);
router.delete('/:id', deleteGoal);

module.exports = router;