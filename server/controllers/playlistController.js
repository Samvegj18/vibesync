/**
 * ============================================
 * PLAYLIST CONTROLLER
 * ============================================
 * Full CRUD for playlists + like/comment system
 * Demonstrates: INSERT, UPDATE, DELETE, JOIN,
 * GROUP BY, subqueries, UNIQUE constraints
 * ============================================
 */

const db = require('../config/db');

// Get all public playlists with stats
exports.getAllPlaylists = async (req, res) => {
  try {
    const [playlists] = await db.query(
      `SELECT p.playlist_id, p.name, p.description, p.cover_image,
              p.visibility, p.created_at,
              u.user_id, u.username, u.avatar AS user_avatar,
              COUNT(DISTINCT ps.song_id) AS song_count,
              COUNT(DISTINCT l.like_id) AS like_count
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
       LEFT JOIN likes l ON p.playlist_id = l.playlist_id
       WHERE p.visibility = 'public'
       GROUP BY p.playlist_id
       ORDER BY p.created_at DESC`
    );

    res.json({ success: true, playlists });
  } catch (error) {
    console.error('GetAllPlaylists error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single playlist with its songs
exports.getPlaylistById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get playlist info
    const [playlists] = await db.query(
      `SELECT p.*, u.username, u.avatar AS user_avatar,
              COUNT(DISTINCT l.like_id) AS like_count
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN likes l ON p.playlist_id = l.playlist_id
       WHERE p.playlist_id = ?
       GROUP BY p.playlist_id`,
      [id]
    );

    if (playlists.length === 0) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    // Get songs in this playlist (Multiple JOINs)
    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
              a.name AS artist_name, ps.added_at
       FROM playlist_songs ps
       INNER JOIN songs s ON ps.song_id = s.song_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE ps.playlist_id = ?
       ORDER BY ps.added_at DESC`,
      [id]
    );

    res.json({
      success: true,
      playlist: { ...playlists[0], songs }
    });
  } catch (error) {
    console.error('GetPlaylistById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;
    const userId = req.user.userId;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Playlist name is required' });
    }

    const [result] = await db.query(
      'INSERT INTO playlists (user_id, name, description, visibility) VALUES (?, ?, ?, ?)',
      [userId, name, description || null, visibility || 'public']
    );

    res.status(201).json({
      success: true,
      message: 'Playlist created! 🎵',
      playlist: {
        playlistId: result.insertId,
        name,
        description,
        visibility: visibility || 'public'
      }
    });
  } catch (error) {
    console.error('CreatePlaylist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a playlist (only owner can update)
exports.updatePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, visibility } = req.body;
    const userId = req.user.userId;

    // Check ownership
    const [playlist] = await db.query(
      'SELECT user_id FROM playlists WHERE playlist_id = ?', [id]
    );

    if (playlist.length === 0) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await db.query(
      'UPDATE playlists SET name = ?, description = ?, visibility = ? WHERE playlist_id = ?',
      [name, description, visibility, id]
    );

    res.json({ success: true, message: 'Playlist updated!' });
  } catch (error) {
    console.error('UpdatePlaylist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const [playlist] = await db.query(
      'SELECT user_id FROM playlists WHERE playlist_id = ?', [id]
    );

    if (playlist.length === 0) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist[0].user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // CASCADE will auto-delete related playlist_songs, likes, comments
    await db.query('DELETE FROM playlists WHERE playlist_id = ?', [id]);

    res.json({ success: true, message: 'Playlist deleted' });
  } catch (error) {
    console.error('DeletePlaylist error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a song to a playlist
exports.addSong = async (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;

    await db.query(
      'INSERT IGNORE INTO playlist_songs (playlist_id, song_id) VALUES (?, ?)',
      [id, songId]
    );

    res.json({ success: true, message: 'Song added to playlist! 🎶' });
  } catch (error) {
    console.error('AddSong error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Remove a song from a playlist
exports.removeSong = async (req, res) => {
  try {
    const { id, songId } = req.params;

    await db.query(
      'DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?',
      [id, songId]
    );

    res.json({ success: true, message: 'Song removed from playlist' });
  } catch (error) {
    console.error('RemoveSong error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Toggle like on a playlist (like if not liked, unlike if already liked)
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if already liked
    const [existing] = await db.query(
      'SELECT like_id FROM likes WHERE user_id = ? AND playlist_id = ?',
      [userId, id]
    );

    if (existing.length > 0) {
      // Unlike - remove the like
      await db.query(
        'DELETE FROM likes WHERE user_id = ? AND playlist_id = ?',
        [userId, id]
      );
      res.json({ success: true, liked: false, message: 'Playlist unliked' });
    } else {
      // Like - add new like
      await db.query(
        'INSERT INTO likes (user_id, playlist_id) VALUES (?, ?)',
        [userId, id]
      );
      res.json({ success: true, liked: true, message: 'Playlist liked! ❤️' });
    }
  } catch (error) {
    console.error('ToggleLike error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get comments on a playlist
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const [comments] = await db.query(
      `SELECT c.comment_id, c.comment_text, c.created_at,
              u.user_id, u.username, u.avatar
       FROM comments c
       INNER JOIN users u ON c.user_id = u.user_id
       WHERE c.playlist_id = ?
       ORDER BY c.created_at DESC`,
      [id]
    );

    res.json({ success: true, comments });
  } catch (error) {
    console.error('GetComments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add a comment to a playlist
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.userId;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Comment text required' });
    }

    const [result] = await db.query(
      'INSERT INTO comments (user_id, playlist_id, comment_text) VALUES (?, ?, ?)',
      [userId, id, text]
    );

    res.status(201).json({
      success: true,
      message: 'Comment added! 💬',
      comment: {
        commentId: result.insertId,
        text,
        userId
      }
    });
  } catch (error) {
    console.error('AddComment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
