/**
 * ============================================
 * SONG ROUTES - Browse & Search Songs
 * ============================================
 * GET /api/songs          - Get all songs
 * GET /api/songs/trending - Get trending songs
 * GET /api/songs/search   - Search songs
 * GET /api/songs/:id      - Get song by ID
 * ============================================
 */

const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.getAllSongs);
router.get('/trending', songController.getTrendingSongs);
router.get('/search', songController.searchSongs);
router.get('/:id', songController.getSongById);

module.exports = router;
