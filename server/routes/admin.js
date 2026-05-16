/**
 * ============================================
 * ADMIN ROUTES - Platform Management
 * ============================================
 * GET    /api/admin/stats        - Dashboard stats
 * GET    /api/admin/users        - List users
 * DELETE /api/admin/users/:id    - Delete user
 * GET    /api/admin/songs        - List songs
 * POST   /api/admin/songs        - Add song
 * DELETE /api/admin/songs/:id    - Delete song
 * GET    /api/admin/artists      - List artists
 * POST   /api/admin/artists      - Add artist
 * DELETE /api/admin/artists/:id  - Delete artist
 * GET    /api/admin/moods        - List moods
 * POST   /api/admin/moods        - Add mood
 * DELETE /api/admin/moods/:id    - Delete mood
 * ============================================
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

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
