/**
 * ============================================
 * AI ROUTES - Mood Analyzer, Playlist Gen, VibeBot
 * ============================================
 * POST /api/ai/analyze-mood     - Analyze user's mood from text
 * POST /api/ai/generate-playlist - Generate playlist from mood+activity
 * POST /api/ai/vibebot          - Chat with VibeBot
 * GET  /api/ai/quote            - Get mood-based quote
 * ============================================
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/analyze-mood', aiController.analyzeMood);
router.post('/generate-playlist', aiController.generatePlaylist);
router.post('/vibebot', aiController.vibeBot);
router.get('/quote', aiController.getQuote);

module.exports = router;
