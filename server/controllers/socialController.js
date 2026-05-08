/**
 * ============================================
 * SOCIAL CONTROLLER
 * ============================================
 * Follow/unfollow system, activity feed, profiles
 * Demonstrates: Self-referencing JOIN, subqueries,
 * INSERT, DELETE, composite keys
 * ============================================
 */

const db = require('../config/db');

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = parseInt(req.params.userId);

    // Can't follow yourself
    if (followerId === followingId) {
      return res.status(400).json({ success: false, message: "You can't follow yourself" });
    }

    // Check if target user exists
    const [targetUser] = await db.query(
      'SELECT user_id FROM users WHERE user_id = ?', [followingId]
    );

    if (targetUser.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Insert follow (IGNORE prevents duplicate errors due to composite PK)
    await db.query(
      'INSERT IGNORE INTO followers (follower_id, following_id) VALUES (?, ?)',
      [followerId, followingId]
    );

    res.json({ success: true, message: 'Now following! 🤝' });
  } catch (error) {
    console.error('FollowUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = parseInt(req.params.userId);

    await db.query(
      'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
      [followerId, followingId]
    );

    res.json({ success: true, message: 'Unfollowed' });
  } catch (error) {
    console.error('UnfollowUser error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get my followers (who follows me)
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Self-referencing JOIN: followers table joins users table twice
    const [followers] = await db.query(
      `SELECT u.user_id, u.username, u.avatar, u.bio, f.created_at
       FROM followers f
       INNER JOIN users u ON f.follower_id = u.user_id
       WHERE f.following_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({ success: true, followers });
  } catch (error) {
    console.error('GetFollowers error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get who I follow
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [following] = await db.query(
      `SELECT u.user_id, u.username, u.avatar, u.bio, f.created_at
       FROM followers f
       INNER JOIN users u ON f.following_id = u.user_id
       WHERE f.follower_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({ success: true, following });
  } catch (error) {
    console.error('GetFollowing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get social feed (playlists from people I follow)
// Uses a SUBQUERY to get followed user IDs
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [feed] = await db.query(
      `SELECT p.playlist_id, p.name, p.description, p.cover_image, p.created_at,
              u.user_id, u.username, u.avatar,
              COUNT(DISTINCT ps.song_id) AS song_count,
              COUNT(DISTINCT l.like_id) AS like_count,
              COUNT(DISTINCT c.comment_id) AS comment_count
       FROM playlists p
       INNER JOIN users u ON p.user_id = u.user_id
       LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
       LEFT JOIN likes l ON p.playlist_id = l.playlist_id
       LEFT JOIN comments c ON p.playlist_id = c.playlist_id
       WHERE p.user_id IN (
           SELECT following_id FROM followers WHERE follower_id = ?
       )
       AND p.visibility = 'public'
       GROUP BY p.playlist_id
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json({ success: true, feed });
  } catch (error) {
    console.error('GetFeed error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get a user's public profile
exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user info with stats (LEFT JOINs + GROUP BY)
    const [users] = await db.query(
      `SELECT u.user_id, u.username, u.avatar, u.bio,
              u.vibe_score, u.listening_streak, u.created_at,
              COUNT(DISTINCT p.playlist_id) AS playlist_count,
              COUNT(DISTINCT f1.following_id) AS following_count,
              COUNT(DISTINCT f2.follower_id) AS follower_count
       FROM users u
       LEFT JOIN playlists p ON u.user_id = p.user_id
       LEFT JOIN followers f1 ON u.user_id = f1.follower_id
       LEFT JOIN followers f2 ON u.user_id = f2.following_id
       WHERE u.user_id = ?
       GROUP BY u.user_id`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get their public playlists
    const [playlists] = await db.query(
      `SELECT p.playlist_id, p.name, p.description, p.cover_image, p.created_at,
              COUNT(DISTINCT ps.song_id) AS song_count,
              COUNT(DISTINCT l.like_id) AS like_count
       FROM playlists p
       LEFT JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
       LEFT JOIN likes l ON p.playlist_id = l.playlist_id
       WHERE p.user_id = ? AND p.visibility = 'public'
       GROUP BY p.playlist_id
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      profile: { ...users[0], playlists }
    });
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
