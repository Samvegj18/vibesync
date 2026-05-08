/**
 * ============================================
 * JWT AUTHENTICATION MIDDLEWARE
 * ============================================
 * 
 * This middleware checks if a request has a valid
 * JWT token. It protects routes that require login.
 * 
 * How JWT works:
 * 1. User logs in → server creates a JWT token
 * 2. Token is sent back to the client
 * 3. Client sends token in every request header
 * 4. This middleware verifies the token
 * 5. If valid → allows access
 * 6. If invalid → returns 401 Unauthorized
 * ============================================
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from the Authorization header
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    // Now all route handlers can access req.user
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email
    };

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

module.exports = authMiddleware;
