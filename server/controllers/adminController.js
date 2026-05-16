/**
 * ============================================
 * ADMIN CONTROLLER - Platform Management
 * ============================================
 * CRUD operations for managing users, songs,
 * artists, and moods from the admin panel.
 * ============================================
 */

const db = require('../config/db');

// GET /api/admin/stats — Dashboard overview
exports.getStats = async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) as count FROM users');
    const [[songs]] = await db.query('SELECT COUNT(*) as count FROM songs');
    const [[artists]] = await db.query('SELECT COUNT(*) as count FROM artists');
    const [[moods]] = await db.query('SELECT COUNT(*) as count FROM moods');
    const [[playlists]] = await db.query('SELECT COUNT(*) as count FROM playlists');
    const [[plays]] = await db.query('SELECT COALESCE(SUM(play_count),0) as total FROM songs');
    const [[comments]] = await db.query('SELECT COUNT(*) as count FROM comments');
    const [[likes]] = await db.query('SELECT COUNT(*) as count FROM likes');

    res.json({
      success: true,
      stats: {
        users: users.count,
        songs: songs.count,
        artists: artists.count,
        moods: moods.count,
        playlists: playlists.count,
        total_plays: plays.total,
        comments: comments.count,
        likes: likes.count
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// GET /api/admin/users — List all users
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT u.user_id, u.username, u.email, u.avatar, u.bio, 
             u.vibe_score, u.listening_streak, u.created_at,
             COUNT(DISTINCT p.playlist_id) as playlist_count
      FROM users u
      LEFT JOIN playlists p ON u.user_id = p.user_id
      GROUP BY u.user_id
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Admin get users error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// DELETE /api/admin/users/:id — Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Admin delete user error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// GET /api/admin/songs — List all songs with artist
exports.getSongs = async (req, res) => {
  try {
    const [songs] = await db.query(`
      SELECT s.song_id, s.title, s.duration, s.cover_image, s.play_count, s.created_at,
             a.name as artist_name, a.artist_id
      FROM songs s
      JOIN artists a ON s.artist_id = a.artist_id
      ORDER BY s.play_count DESC
    `);
    res.json({ success: true, songs });
  } catch (error) {
    console.error('Admin get songs error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch songs' });
  }
};

// POST /api/admin/songs — Add a new song
exports.addSong = async (req, res) => {
  try {
    const { title, artist_id, duration, cover_image, audio_url } = req.body;
    if (!title || !artist_id) {
      return res.status(400).json({ success: false, message: 'Title and artist are required' });
    }
    const [result] = await db.query(
      'INSERT INTO songs (title, artist_id, duration, cover_image, audio_url) VALUES (?, ?, ?, ?, ?)',
      [title, artist_id, duration || 180, cover_image || 'default_cover.png', audio_url || null]
    );
    res.json({ success: true, message: 'Song added', songId: result.insertId });
  } catch (error) {
    console.error('Admin add song error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add song' });
  }
};

// DELETE /api/admin/songs/:id — Delete a song
exports.deleteSong = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM songs WHERE song_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    res.json({ success: true, message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Admin delete song error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete song' });
  }
};

// GET /api/admin/artists — List all artists
exports.getArtists = async (req, res) => {
  try {
    const [artists] = await db.query(`
      SELECT a.artist_id, a.name, a.bio, a.avatar,
             COUNT(s.song_id) as song_count,
             COALESCE(SUM(s.play_count), 0) as total_plays
      FROM artists a
      LEFT JOIN songs s ON a.artist_id = s.artist_id
      GROUP BY a.artist_id
      ORDER BY total_plays DESC
    `);
    res.json({ success: true, artists });
  } catch (error) {
    console.error('Admin get artists error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch artists' });
  }
};

// POST /api/admin/artists — Add a new artist
exports.addArtist = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Artist name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO artists (name, bio, avatar) VALUES (?, ?, ?)',
      [name, bio || null, avatar || 'default_artist.png']
    );
    res.json({ success: true, message: 'Artist added', artistId: result.insertId });
  } catch (error) {
    console.error('Admin add artist error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add artist' });
  }
};

// DELETE /api/admin/artists/:id — Delete an artist
exports.deleteArtist = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM artists WHERE artist_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Artist not found' });
    }
    res.json({ success: true, message: 'Artist deleted successfully' });
  } catch (error) {
    console.error('Admin delete artist error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete artist' });
  }
};

// GET /api/admin/moods — List all moods
exports.getMoods = async (req, res) => {
  try {
    const [moods] = await db.query(`
      SELECT m.mood_id, m.mood_name, m.mood_color, m.mood_icon,
             COUNT(sm.song_id) as song_count
      FROM moods m
      LEFT JOIN song_mood sm ON m.mood_id = sm.mood_id
      GROUP BY m.mood_id
      ORDER BY song_count DESC
    `);
    res.json({ success: true, moods });
  } catch (error) {
    console.error('Admin get moods error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch moods' });
  }
};

// POST /api/admin/moods — Add a new mood
exports.addMood = async (req, res) => {
  try {
    const { mood_name, mood_color, mood_icon } = req.body;
    if (!mood_name) {
      return res.status(400).json({ success: false, message: 'Mood name is required' });
    }
    const [result] = await db.query(
      'INSERT INTO moods (mood_name, mood_color, mood_icon) VALUES (?, ?, ?)',
      [mood_name, mood_color || '#ffffff', mood_icon || 'music']
    );
    res.json({ success: true, message: 'Mood added', moodId: result.insertId });
  } catch (error) {
    console.error('Admin add mood error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to add mood' });
  }
};

// DELETE /api/admin/moods/:id — Delete a mood
exports.deleteMood = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM moods WHERE mood_id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Mood not found' });
    }
    res.json({ success: true, message: 'Mood deleted successfully' });
  } catch (error) {
    console.error('Admin delete mood error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete mood' });
  }
};
