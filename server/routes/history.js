/**
 * ============================================
 * HISTORY ROUTES - Listening History & Streaks
 * ============================================
 * POST /api/history/play        - Record a play (auth required)
 * POST /api/history/track-play  - Record a play (public, no auth needed)
 * GET  /api/history/recent      - Recent plays (auth required)
 * ============================================
 */

const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middleware/auth');

router.post('/play', auth, historyController.recordPlay);
router.post('/track-play', historyController.recordPlayPublic); // Public — no auth needed
router.get('/recent', auth, historyController.getRecentHistory);

module.exports = router;
