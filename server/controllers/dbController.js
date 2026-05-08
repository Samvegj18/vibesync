/**
 * Database Explorer Controller
 * Shows schema, views, triggers, procedures for viva demonstration
 */
const db = require('../config/db');

const dbController = {
  // GET /api/database/tables — Show all table structures
  getTables: async (req, res) => {
    try {
      const [tables] = await db.query("SHOW TABLES");
      const tableNames = tables.map(t => Object.values(t)[0]);
      
      const tableDetails = [];
      for (const name of tableNames) {
        const [columns] = await db.query(`DESCRIBE ${name}`);
        const [countResult] = await db.query(`SELECT COUNT(*) as count FROM ${name}`);
        tableDetails.push({
          name,
          columns,
          rowCount: countResult[0].count
        });
      }
      
      res.json({ tables: tableDetails });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/database/views — Show view definitions and sample data
  getViews: async (req, res) => {
    try {
      const views = [
        { name: 'vw_song_details', description: 'Songs with artist info (INNER JOIN)', query: 'SELECT * FROM vw_song_details LIMIT 5' },
        { name: 'vw_playlist_details', description: 'Playlists with creator & stats (LEFT JOIN + GROUP BY)', query: 'SELECT * FROM vw_playlist_details LIMIT 5' },
        { name: 'vw_user_stats', description: 'User profiles with follower counts', query: 'SELECT * FROM vw_user_stats LIMIT 5' },
        { name: 'vw_trending_songs', description: 'Trending songs by play count (ORDER BY DESC)', query: 'SELECT * FROM vw_trending_songs LIMIT 5' },
        { name: 'vw_mood_popularity', description: 'Mood popularity with play totals (COALESCE + SUM)', query: 'SELECT * FROM vw_mood_popularity' },
      ];

      const results = [];
      for (const v of views) {
        try {
          const [rows] = await db.query(v.query);
          results.push({ ...v, data: rows, status: 'active' });
        } catch {
          results.push({ ...v, data: [], status: 'not_created' });
        }
      }

      res.json({ views: results });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/database/triggers — Show trigger definitions
  getTriggers: async (req, res) => {
    try {
      const [triggers] = await db.query("SHOW TRIGGERS FROM vibesync");
      
      const triggerInfo = [
        { name: 'trg_increment_play_count', event: 'AFTER INSERT ON listening_history', description: 'Auto-increments play_count when a song is played', sql: 'UPDATE songs SET play_count = play_count + 1 WHERE song_id = NEW.song_id;' },
        { name: 'trg_playlist_vibe_score', event: 'AFTER INSERT ON playlists', description: 'Awards 10 vibe points when user creates a playlist', sql: 'UPDATE users SET vibe_score = vibe_score + 10 WHERE user_id = NEW.user_id;' },
        { name: 'trg_like_vibe_score', event: 'AFTER INSERT ON likes', description: 'Awards 5 vibe points to playlist creator when liked', sql: 'UPDATE users SET vibe_score = vibe_score + 5 WHERE user_id = (SELECT user_id FROM playlists WHERE playlist_id = NEW.playlist_id);' },
        { name: 'trg_unlike_vibe_score', event: 'AFTER DELETE ON likes', description: 'Removes 5 vibe points when a like is removed', sql: 'UPDATE users SET vibe_score = GREATEST(vibe_score - 5, 0) WHERE user_id = (SELECT user_id FROM playlists WHERE playlist_id = OLD.playlist_id);' },
      ];

      res.json({ 
        triggers: triggerInfo,
        activeCount: triggers.length,
        activeTriggers: triggers.map(t => t.Trigger)
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // GET /api/database/procedures — Show stored procedures
  getProcedures: async (req, res) => {
    try {
      const procedures = [
        { name: 'sp_get_songs_by_mood', params: 'IN p_mood_name VARCHAR(50)', description: 'Returns all songs matching a specific mood using INNER JOINs across 4 tables', sql: "CALL sp_get_songs_by_mood('Heartbreak');" },
        { name: 'sp_get_user_dashboard', params: 'IN p_user_id INT', description: 'Returns user stats + recent listening history (multi-result set)', sql: 'CALL sp_get_user_dashboard(1);' },
        { name: 'sp_playlist_engagement', params: 'IN p_playlist_id INT', description: 'Calculates likes, comments, and song count for engagement metrics', sql: 'CALL sp_playlist_engagement(1);' },
        { name: 'sp_trending_mood', params: 'None', description: 'Finds the trending mood based on last 24h listening history', sql: 'CALL sp_trending_mood();' },
      ];

      res.json({ procedures });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // POST /api/database/query — Run a safe SELECT query (for demo)
  runQuery: async (req, res) => {
    try {
      const { query } = req.body;
      
      // Safety: only allow SELECT, SHOW, DESCRIBE, CALL
      const safe = query.trim().toUpperCase();
      if (!safe.startsWith('SELECT') && !safe.startsWith('SHOW') && !safe.startsWith('DESCRIBE') && !safe.startsWith('CALL')) {
        return res.status(403).json({ message: 'Only SELECT, SHOW, DESCRIBE, and CALL queries are allowed' });
      }

      const [rows] = await db.query(query);
      res.json({ results: Array.isArray(rows) ? rows : [rows], rowCount: Array.isArray(rows) ? rows.length : 1 });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // GET /api/database/er-diagram — Returns ER diagram data
  getERDiagram: async (req, res) => {
    try {
      const [fks] = await db.query(`
        SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
        FROM information_schema.KEY_COLUMN_USAGE
        WHERE TABLE_SCHEMA = 'vibesync' AND REFERENCED_TABLE_NAME IS NOT NULL
      `);
      
      res.json({ relationships: fks });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = dbController;
