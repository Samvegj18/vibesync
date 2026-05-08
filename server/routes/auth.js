/**
 * ============================================
 * AUTH ROUTES - Login & Register
 * ============================================
 * POST /api/auth/register - Create new account
 * POST /api/auth/login    - Login & get token
 * GET  /api/auth/me       - Get current user (protected)
 * ============================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes (no token needed)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route (token required)
router.get('/me', auth, authController.getMe);

module.exports = router;
