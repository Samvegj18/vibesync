/**
 * ============================================
 * MOOD ROUTES - Browse Moods & Mood Songs
 * ============================================
 * GET /api/moods          - All moods
 * GET /api/moods/trending - Trending mood today
 * GET /api/moods/:id/songs - Songs for a mood
 * ============================================
 */

const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.get('/', moodController.getAllMoods);
router.get('/trending', moodController.getTrendingMood);
router.get('/:id/songs', moodController.getSongsByMood);

module.exports = router;
