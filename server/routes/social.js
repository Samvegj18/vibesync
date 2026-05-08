/**
 * ============================================
 * SOCIAL ROUTES - Follow, Feed, Profiles
 * ============================================
 * POST   /api/social/follow/:userId   - Follow user (auth)
 * DELETE /api/social/unfollow/:userId  - Unfollow user (auth)
 * GET    /api/social/followers         - My followers (auth)
 * GET    /api/social/following         - Who I follow (auth)
 * GET    /api/social/feed              - Activity feed (auth)
 * GET    /api/social/profile/:userId   - View profile
 * ============================================
 */

const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const auth = require('../middleware/auth');

// Public
router.get('/profile/:userId', socialController.getProfile);

// Protected
router.post('/follow/:userId', auth, socialController.followUser);
router.delete('/unfollow/:userId', auth, socialController.unfollowUser);
router.get('/followers', auth, socialController.getFollowers);
router.get('/following', auth, socialController.getFollowing);
router.get('/feed', auth, socialController.getFeed);

module.exports = router;
