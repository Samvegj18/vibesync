/**
 * ============================================
 * ANALYTICS ROUTES - Admin Dashboard Stats
 * ============================================
 * GET /api/analytics/overview     - Platform overview
 * GET /api/analytics/top-moods    - Most popular moods
 * GET /api/analytics/top-songs    - Most played songs
 * GET /api/analytics/top-playlists - Most liked playlists
 * GET /api/analytics/active-users - Most active users
 * GET /api/analytics/engagement   - Engagement stats
 * ============================================
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/top-moods', analyticsController.getTopMoods);
router.get('/top-songs', analyticsController.getTopSongs);
router.get('/top-playlists', analyticsController.getTopPlaylists);
router.get('/active-users', analyticsController.getActiveUsers);
router.get('/engagement', analyticsController.getEngagement);

module.exports = router;
