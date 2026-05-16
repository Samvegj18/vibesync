/**
 * ============================================
 * ADMIN ROUTES - Protected Platform Management
 * ============================================
 * All routes require authentication + admin role
 * ============================================
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

// All admin routes require login + admin check
router.use(auth, admin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);
router.get('/songs', adminController.getSongs);
router.post('/songs', adminController.addSong);
router.delete('/songs/:id', adminController.deleteSong);
router.get('/artists', adminController.getArtists);
router.post('/artists', adminController.addArtist);
router.delete('/artists/:id', adminController.deleteArtist);
router.get('/moods', adminController.getMoods);
router.post('/moods', adminController.addMood);
router.delete('/moods/:id', adminController.deleteMood);

module.exports = router;
