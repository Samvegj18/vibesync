/**
 * ============================================
 * ANALYTICS CONTROLLER
 * ============================================
 * Admin dashboard stats with heavy SQL usage
 * Demonstrates: COUNT, SUM, AVG, GROUP BY,
 * HAVING, ORDER BY, JOINs, subqueries
 * 
 * THIS IS THE MOST DBMS-HEAVY CONTROLLER
 * Perfect for viva demonstrations!
 * ============================================
 */

const db = require('../config/db');

// ============================================
// 1. PLATFORM OVERVIEW
// Uses subqueries to get counts from each table
// ============================================
exports.getOverview = async (req, res) => {
  try {
    const [overview] = await db.query(
      `SELECT 
         (SELECT COUNT(*) FROM users) AS total_users,
         (SELECT COUNT(*) FROM songs) AS total_songs,
         (SELECT COUNT(*) FROM playlists) AS total_playlists,
         (SELECT COUNT(*) FROM artists) AS total_artists,
         (SELECT SUM(play_count) FROM songs) AS total_plays,
         (SELECT COUNT(*) FROM likes) AS total_likes,
         (SELECT COUNT(*) FROM comments) AS total_comments`
    );

    res.json({ success: true, overview: overview[0] });
  } catch (error) {
    console.error('GetOverview error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 2. TOP MOODS
// JOIN + GROUP BY + SUM + ORDER BY
// Shows which moods have the most plays
// ============================================
exports.getTopMoods = async (req, res) => {
  try {
    const [moods] = await db.query(
      `SELECT m.mood_id, m.mood_name, m.mood_color, m.mood_icon,
              COUNT(sm.song_id) AS song_count,
              COALESCE(SUM(s.play_count), 0) AS total_plays
       FROM moods m
       LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id
       LEFT JOIN songs s ON sm.song_id = s.song_id
       GROUP BY m.mood_id
       ORDER BY total_plays DESC`
    );

    res.json({ success: true, moods });
  } catch (error) {
    console.error('GetTopMoods error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 3. TOP SONGS
// INNER JOIN + ORDER BY play_count DESC
// Most played songs across the platform
// ============================================
exports.getTopSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const [songs] = await db.query(
      `SELECT s.song_id, s.title, s.play_count, s.cover_image,
              a.name AS artist_name,
              GROUP_CONCAT(DISTINCT m.mood_name) AS moods,
              COUNT(DISTINCT ps.playlist_id) AS in_playlists
       FROM songs s
       INNER JOIN artists a ON s.artist_id = a.artist_id
       LEFT JOIN song_mood sm ON s.song_id = sm.song_id
       LEFT JOIN moods m ON sm.mood_id = m.mood_id
       LEFT JOIN playlist_songs ps ON s.song_id = ps.song_id
       GROUP BY s.song_id
       ORDER BY s.play_count DESC
       LIMIT ?`,
      [limit]
    );

    res.json({ success: true, songs });
  } catch (error) {
    console.error('GetTopSongs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 4. TOP PLAYLISTS
// Multiple JOINs + GROUP BY + COUNT + HAVING
// Playlists with most engagement (likes + comments)
// ============================================
exports.getTopPlaylists = async (req, res) => {
  try {
    const [playlists] = await db.query(
      `SELECT p.playlist_id, p.name, p.created_at,
              u.username AS creator,
              COUNT(DISTINCT l.like_id) AS like_count,
              COUNT(DISTINCT c.comment_id) AS comment_count,
              COUNT(DISTINCT ps.song_id) AS song_count,
              (COUNT(DISTINCT l.like_id) + COUNT(DISTINCT c.comment_id)) AS engagement
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN likes l ON p.playlist_id = l.playlist_id
       LEFT JOIN comments c ON p.playlist_id = c.playlist_id
       LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
       WHERE p.visibility = 'public'
       GROUP BY p.playlist_id
       HAVING engagement > 0
       ORDER BY engagement DESC
       LIMIT 10`
    );

    res.json({ success: true, playlists });
  } catch (error) {
    console.error('GetTopPlaylists error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 5. ACTIVE USERS
// JOIN + GROUP BY + COUNT + ORDER BY
// Users with the most activity
// ============================================
exports.getActiveUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.user_id, u.username, u.avatar, u.vibe_score,
              u.listening_streak,
              COUNT(DISTINCT lh.history_id) AS songs_played,
              COUNT(DISTINCT p.playlist_id) AS playlists_created,
              COUNT(DISTINCT l.like_id) AS likes_given
       FROM users u
       LEFT JOIN listening_history lh ON u.user_id = lh.user_id
       LEFT JOIN playlists p ON u.user_id = p.user_id
       LEFT JOIN likes l ON u.user_id = l.user_id
       GROUP BY u.user_id
       ORDER BY u.vibe_score DESC
       LIMIT 10`
    );

    res.json({ success: true, users });
  } catch (error) {
    console.error('GetActiveUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================
// 6. ENGAGEMENT STATS
// Complex aggregation for charts
// ============================================
exports.getEngagement = async (req, res) => {
  try {
    // Songs per mood (for pie/bar chart)
    const [songsPerMood] = await db.query(
      `SELECT m.mood_name, m.mood_color, COUNT(sm.song_id) AS count
       FROM moods m
       LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id
       GROUP BY m.mood_id
       ORDER BY count DESC`
    );

    // Average plays per artist
    const [avgPerArtist] = await db.query(
      `SELECT a.name, ROUND(AVG(s.play_count)) AS avg_plays,
              COUNT(s.song_id) AS song_count
       FROM artists a
       INNER JOIN songs s ON a.artist_id = s.artist_id
       GROUP BY a.artist_id
       ORDER BY avg_plays DESC`
    );

    // Playlist visibility distribution
    const [visibilityDist] = await db.query(
      `SELECT visibility, COUNT(*) AS count
       FROM playlists
       GROUP BY visibility`
    );

    res.json({
      success: true,
      engagement: {
        songsPerMood,
        avgPerArtist,
        visibilityDist
      }
    });
  } catch (error) {
    console.error('GetEngagement error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
