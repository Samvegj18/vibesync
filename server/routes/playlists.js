/**
 * ============================================
 * PLAYLIST ROUTES - CRUD + Social
 * ============================================
 * GET    /api/playlists              - All public playlists
 * POST   /api/playlists              - Create playlist (auth)
 * GET    /api/playlists/:id          - Get playlist details
 * PUT    /api/playlists/:id          - Update playlist (auth)
 * DELETE /api/playlists/:id          - Delete playlist (auth)
 * POST   /api/playlists/:id/songs    - Add song (auth)
 * DELETE /api/playlists/:id/songs/:songId - Remove song (auth)
 * POST   /api/playlists/:id/like     - Like/unlike playlist (auth)
 * GET    /api/playlists/:id/comments - Get comments
 * POST   /api/playlists/:id/comments - Add comment (auth)
 * ============================================
 */

const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const auth = require('../middleware/auth');

// Public
router.get('/', playlistController.getAllPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.get('/:id/comments', playlistController.getComments);

// Protected (require login)
router.post('/', auth, playlistController.createPlaylist);
router.put('/:id', auth, playlistController.updatePlaylist);
router.delete('/:id', auth, playlistController.deletePlaylist);
router.post('/:id/songs', auth, playlistController.addSong);
router.delete('/:id/songs/:songId', auth, playlistController.removeSong);
router.post('/:id/like', auth, playlistController.toggleLike);
router.post('/:id/comments', auth, playlistController.addComment);

module.exports = router;
