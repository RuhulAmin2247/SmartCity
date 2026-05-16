const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

// GET — dashboard stats
router.get('/stats', protect, getDashboardStats);

module.exports = router;