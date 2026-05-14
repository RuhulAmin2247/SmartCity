// Express router আনছি
const express = require('express');
const router = express.Router();

// Middleware আনছি — token check করবে
const protect = require('../middleware/authMiddleware');

// Controller থেকে functions আনছি
const { register, login, getProfile } = require('../controllers/authController');

// POST /api/auth/register — নতুন citizen তৈরি
router.post('/register', register);

// POST /api/auth/login — login করা
router.post('/login', login);

// GET /api/auth/profile — শুধু login করা citizen দেখতে পাবে
router.get('/profile', protect, getProfile);

// Export করছি
module.exports = router;