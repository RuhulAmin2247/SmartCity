const express = require('express');
const router = express.Router();

// Middleware
const protect = require('../middleware/authMiddleware');

// Controller
const {
  submitPayment,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus,
} = require('../controllers/paymentController');

// POST — payment request submit
router.post('/', protect, submitPayment);

// GET — আমার payments
router.get('/my', protect, getMyPayments);

// GET — সব payments (admin)
router.get('/all', protect, getAllPayments);

// PUT — approve/reject (admin)
router.put('/:id/status', protect, updatePaymentStatus);

module.exports = router;