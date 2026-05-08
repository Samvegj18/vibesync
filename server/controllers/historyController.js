/**
 * ============================================
 * HISTORY CONTROLLER
 * ============================================
 * Records song plays and fetches recent history
 * Demonstrates: INSERT, JOIN, ORDER BY, LIMIT
 * ============================================
 */

const db = require('../config/db');

// Record a song play (authenticated — adds to listening_history)
// The trigger trg_increment_play_count auto-updates songs.play_count
exports.recordPlay = async (req, res) => {
  try {
    const { songId } = req.body;
    const userId = req.user.userId;

    if (!songId) {
      return res.status(400).json({ success: false, message: 'Song ID required' });
    }

    // Insert into listening history
    // The trigger will automatically increment play_count in songs table
    await db.query(
      'INSERT INTO listening_history (user_id, song_id) VALUES (?, ?)',
      [userId, songId]
    );

    // Update listening streak (simple: just increment)
    await db.query(
      'UPDATE users SET listening_streak = listening_streak + 1, vibe_score = vibe_score + 1 WHERE user_id = ?',
      [userId]
    );

    res.json({ success: true, message: 'Play recorded! 🎵' });
  } catch (error) {
    console.error('RecordPlay error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Record a song play (public — works with or without login)
// If logged in, uses user ID from token; otherwise uses a default guest user
exports.recordPlayPublic = async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ success: false, message: 'Song ID required' });
    }

    // Determine user ID: from auth header if present, otherwise use guest (user_id = 1)
    let userId = 1; // default guest
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch {} // ignore invalid tokens, use guest
    }

    // Insert into listening history — trigger auto-increments play_count
    await db.query(
      'INSERT INTO listening_history (user_id, song_id) VALUES (?, ?)',
      [userId, songId]
    );

    // Update user stats
    await db.query(
      'UPDATE users SET listening_streak = listening_streak + 1, vibe_score = vibe_score + 1 WHERE user_id = ?',
      [userId]
    );

    // Get updated play count
    const [song] = await db.query('SELECT play_count FROM songs WHERE song_id = ?', [songId]);
    const playCount = song[0]?.play_count || 0;

    res.json({ 
      success: true, 
      message: 'Play recorded! 🎵',
      play_count: playCount,
      user_id: userId
    });
  } catch (error) {
    console.error('RecordPlayPublic error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get recent listening history for the logged-in user
exports.getRecentHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;

    // JOIN listening_history with songs and artists
    const [history] = await db.query(
      `SELECT lh.history_id, lh.played_at,
              s.song_id, s.title, s.duration, s.cover_image,
              a.name AS artist_name
       FROM listening_history lh
       INNER JOIN songs s ON lh.song_id = s.song_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE lh.user_id = ?
       ORDER BY lh.played_at DESC
       LIMIT ?`,
      [userId, limit]
    );

    res.json({ success: true, history });
  } catch (error) {
    console.error('GetRecentHistory error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
