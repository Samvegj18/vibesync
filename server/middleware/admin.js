/**
 * Admin Middleware — Checks if logged-in user is an admin
 * Must be used AFTER the auth middleware
 */
const db = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  try {
    const [users] = await db.query(
      'SELECT is_admin FROM users WHERE user_id = ?',
      [req.user.userId]
    );
    if (users.length === 0 || users[0].is_admin !== 1) {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = adminMiddleware;
