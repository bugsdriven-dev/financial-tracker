const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, deleteTransaction, getSummary } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes below need login

router.post('/', addTransaction);
router.get('/', getTransactions);
router.get('/summary', getSummary);
router.delete('/:id', deleteTransaction);

module.exports = router;