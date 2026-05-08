/**
 * ============================================
 * SONG CONTROLLER
 * ============================================
 * Handles fetching songs, trending, and search
 * Demonstrates: INNER JOIN, ORDER BY, LIKE
 * ============================================
 */

const db = require('../config/db');

// Get all songs with artist info (INNER JOIN)
exports.getAllSongs = async (req, res) => {
  try {
    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, 
              s.audio_url, s.play_count,
              a.name AS artist_name, a.avatar AS artist_avatar
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       ORDER BY s.title ASC`
    );

    res.json({ success: true, songs });
  } catch (error) {
    console.error('GetAllSongs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get trending songs (ORDER BY play_count DESC)
exports.getTrendingSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
              a.name AS artist_name,
              GROUP_CONCAT(m.mood_name) AS moods
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       LEFT JOIN song_mood sm ON s.song_id = sm.song_id
       LEFT JOIN moods m ON sm.mood_id = m.mood_id
       GROUP BY s.song_id
       ORDER BY s.play_count DESC
       LIMIT ?`,
      [limit]
    );

    res.json({ success: true, songs });
  } catch (error) {
    console.error('GetTrending error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Search songs by title or artist (LIKE query)
exports.searchSongs = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query required' });
    }

    const searchTerm = `%${q}%`;

    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count,
              a.name AS artist_name
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       WHERE s.title LIKE ? OR a.name LIKE ?
       ORDER BY s.play_count DESC
       LIMIT 20`,
      [searchTerm, searchTerm]
    );

    res.json({ success: true, songs });
  } catch (error) {
    console.error('SearchSongs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single song by ID
exports.getSongById = async (req, res) => {
  try {
    const [songs] = await db.query(
      `SELECT s.*, a.name AS artist_name, a.bio AS artist_bio,
              GROUP_CONCAT(m.mood_name) AS moods
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       LEFT JOIN song_mood sm ON s.song_id = sm.song_id
       LEFT JOIN moods m ON sm.mood_id = m.mood_id
       WHERE s.song_id = ?
       GROUP BY s.song_id`,
      [req.params.id]
    );

    if (songs.length === 0) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    res.json({ success: true, song: songs[0] });
  } catch (error) {
    console.error('GetSongById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
