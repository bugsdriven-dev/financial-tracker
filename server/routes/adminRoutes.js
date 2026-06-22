const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/adminAuth');

// All routes below need: 1) logged in, 2) must be admin
router.use(protect);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.get('/stats', getStats);
router.delete('/users/:id', deleteUser);

module.exports = router;