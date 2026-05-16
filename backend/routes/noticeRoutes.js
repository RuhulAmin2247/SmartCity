const express = require('express');
const router = express.Router();

const protect = require('../middleware/authMiddleware');
const {
  publishNotice,
  getAllNotices,
  getNotice,
  deleteNotice,
} = require('../controllers/noticeController');

// POST — notice publish (admin)
router.post('/', protect, publishNotice);

// GET — সব notices
router.get('/', protect, getAllNotices);

// GET — একটা notice
router.get('/:id', protect, getNotice);

// DELETE — notice সরানো (admin)
router.delete('/:id', protect, deleteNotice);

module.exports = router;