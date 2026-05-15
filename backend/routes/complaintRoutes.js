const express = require('express');
const router = express.Router();

// Middlewares
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Controllers
const {
  submitComplaint,
  getMyComplaints,
  getAllComplaints,
  updateStatus,
} = require('../controllers/complaintController');

// POST — complaint submit (max 3 photos)
router.post('/', protect, upload.array('photos', 3), submitComplaint);

// GET — আমার complaints
router.get('/my', protect, getMyComplaints);

// GET — সব complaints (admin)
router.get('/all', protect, getAllComplaints);

// PUT — status update (admin)
router.put('/:id/status', protect, updateStatus);

module.exports = router;