/**
 * Spotify Routes — Spotify API integration endpoints
 */
const express = require('express');
const router = express.Router();
const spotifyController = require('../controllers/spotifyController');

// Search for a track on Spotify
router.get('/search', spotifyController.searchTrack);

// Get preview URL for a specific song
router.get('/preview/:songId', spotifyController.getPreview);

// Sync all songs with Spotify (run once to populate)
router.post('/sync-all', spotifyController.syncAllSongs);

module.exports = router;
