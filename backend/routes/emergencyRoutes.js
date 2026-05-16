const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {
  sendAlert,
  getAllEmergencies,
  updateEmergency,
} = require('../controllers/emergencyController');

// POST — emergency alert পাঠাও
router.post('/', protect, sendAlert);

// GET — সব emergencies (admin)
router.get('/all', protect, getAllEmergencies);

// PUT — status update (admin)
router.put('/:id/status', protect, updateEmergency);

module.exports = router;