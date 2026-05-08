/**
 * ============================================
 * MOOD CONTROLLER
 * ============================================
 * Handles mood browsing, trending moods, and
 * fetching songs filtered by mood
 * Demonstrates: JOIN, GROUP BY, ORDER BY, SUM
 * ============================================
 */

const db = require('../config/db');

// Get all moods with song counts
exports.getAllMoods = async (req, res) => {
  try {
    const [moods] = await db.query(
      `SELECT m.mood_id, m.mood_name, m.mood_color, m.mood_icon,
              COUNT(sm.song_id) AS song_count
       FROM moods m
       LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id
       GROUP BY m.mood_id
       ORDER BY song_count DESC`
    );

    res.json({ success: true, moods });
  } catch (error) {
    console.error('GetAllMoods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get trending mood of the day (most played mood)
exports.getTrendingMood = async (req, res) => {
  try {
    const [moods] = await db.query(
      `SELECT m.mood_id, m.mood_name, m.mood_color, m.mood_icon,
              SUM(s.play_count) AS total_plays
       FROM moods m
       INNER JOIN song_mood sm ON m.mood_id = sm.mood_id
       INNER JOIN songs s ON sm.song_id = s.song_id
       GROUP BY m.mood_id
       ORDER BY total_plays DESC
       LIMIT 1`
    );

    res.json({
      success: true,
      trendingMood: moods[0] || null
    });
  } catch (error) {
    console.error('GetTrendingMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all songs for a specific mood (INNER JOIN through junction table)
exports.getSongsByMood = async (req, res) => {
  try {
    const { id } = req.params;

    // First get mood info
    const [moodInfo] = await db.query(
      'SELECT * FROM moods WHERE mood_id = ?', [id]
    );

    if (moodInfo.length === 0) {
      return res.status(404).json({ success: false, message: 'Mood not found' });
    }

    // Get songs for this mood using junction table
    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
              a.name AS artist_name
       FROM songs s
       INNER JOIN song_mood sm ON s.song_id = sm.song_id
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE sm.mood_id = ?
       ORDER BY s.play_count DESC`,
      [id]
    );

    res.json({
      success: true,
      mood: moodInfo[0],
      songs
    });
  } catch (error) {
    console.error('GetSongsByMood error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
