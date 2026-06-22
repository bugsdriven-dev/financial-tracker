const express = require('express');
const router = express.Router();
const { addInvestment, getInvestments, deleteInvestment } = require('../controllers/investmentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', addInvestment);
router.get('/', getInvestments);
router.delete('/:id', deleteInvestment);

module.exports = router;