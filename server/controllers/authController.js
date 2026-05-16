/**
 * ============================================
 * AUTH CONTROLLER
 * ============================================
 * Handles user registration, login, and profile
 * Uses bcrypt for password hashing
 * Uses JWT for token-based authentication
 * ============================================
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// ============================================
// REGISTER - Create a new user account
// ============================================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email, and password'
      });
    }

    // Check if user already exists (email or username)
    const [existing] = await db.query(
      'SELECT user_id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Hash the password using bcrypt (10 salt rounds)
    // This converts "password123" → "$2a$10$..." (irreversible)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate a random avatar color for the user
    const avatarColors = ['ff4757', '5f27cd', '54a0ff', '1dd1a1', 'ff6b81', 'feca57', 'f368e0'];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const avatar = `https://ui-avatars.com/api/?name=${username}&background=${randomColor}&color=fff&size=200`;

    // INSERT new user into database
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, avatar) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, avatar]
    );

    // Create JWT token for immediate login after registration
    const token = jwt.sign(
      { userId: result.insertId, username, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! 🎵',
      token,
      user: {
        userId: result.insertId,
        username,
        email,
        avatar
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// ============================================
// LOGIN - Authenticate and return JWT token
// ============================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Compare entered password with stored hash
    // bcrypt.compare handles the hashing internally
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful! 🎵',
      token,
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        vibeScore: user.vibe_score,
        listeningStreak: user.listening_streak,
        isAdmin: user.is_admin === 1
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// ============================================
// GET ME - Return current user's profile
// (Protected route - requires valid JWT)
// ============================================
exports.getMe = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const [users] = await db.query(
      `SELECT u.user_id, u.username, u.email, u.avatar, u.bio,
              u.vibe_score, u.listening_streak, u.created_at, u.is_admin,
              COUNT(DISTINCT p.playlist_id) AS playlist_count,
              COUNT(DISTINCT f1.following_id) AS following_count,
              COUNT(DISTINCT f2.follower_id) AS follower_count
       FROM users u
       LEFT JOIN playlists p ON u.user_id = p.user_id
       LEFT JOIN followers f1 ON u.user_id = f1.follower_id
       LEFT JOIN followers f2 ON u.user_id = f2.following_id
       WHERE u.user_id = ?
       GROUP BY u.user_id`,
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: {
      userId: users[0].user_id,
      username: users[0].username,
      email: users[0].email,
      avatar: users[0].avatar,
      bio: users[0].bio,
      vibeScore: users[0].vibe_score,
      listeningStreak: users[0].listening_streak,
      createdAt: users[0].created_at,
      playlistCount: users[0].playlist_count,
      followingCount: users[0].following_count,
      followerCount: users[0].follower_count,
      isAdmin: users[0].is_admin === 1,
    }});

  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
