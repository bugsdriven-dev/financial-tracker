const express = require('express');
const router = express.Router();
const { addHabit, getHabits, completeHabit, deleteHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addHabit);
router.get('/', getHabits);
router.put('/:id/complete', completeHabit);
router.delete('/:id', deleteHabit);

module.exports = router;