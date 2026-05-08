/**
 * ============================================
 * VIBESYNC - Main Server Entry Point
 * ============================================
 * 
 * This is the main file that starts the Express server.
 * It connects all routes, middleware, and the database.
 * 
 * Tech: Node.js + Express.js + MySQL
 * ============================================
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database connection
const db = require('./config/db');

// Import route files
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');
const playlistRoutes = require('./routes/playlists');
const moodRoutes = require('./routes/moods');
const socialRoutes = require('./routes/social');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const historyRoutes = require('./routes/history');
const databaseRoutes = require('./routes/database');
const spotifyRoutes = require('./routes/spotify');

// Create Express app
const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows our React frontend to communicate with this backend
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// API ROUTES
// ============================================
// Each route file handles a specific feature area

app.use('/api/auth', authRoutes);           // Login, Register, Profile
app.use('/api/songs', songRoutes);          // Browse & search songs
app.use('/api/playlists', playlistRoutes);  // Create & manage playlists
app.use('/api/moods', moodRoutes);          // Mood categories
app.use('/api/social', socialRoutes);       // Follow, feed, profiles
app.use('/api/ai', aiRoutes);              // AI mood analyzer, playlist gen, chatbot
app.use('/api/analytics', analyticsRoutes); // Admin analytics dashboard
app.use('/api/history', historyRoutes);     // Listening history & streaks
app.use('/api/database', databaseRoutes);  // Database explorer (viva demo)
app.use('/api/spotify', spotifyRoutes);    // Spotify API integration

// ============================================
// HEALTH CHECK ROUTE
// ============================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🎵 VibeSync API is running!',
    timestamp: new Date().toISOString()
  });
});

// ============================================
// SERVE FRONTEND (Production)
// ============================================
const path = require('path');
const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');

// Serve static files from React build
app.use(express.static(clientBuildPath));

// Catch-all: serve index.html for any non-API route (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================
// This catches any errors thrown in route handlers
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║    🎵 VibeSync Server Running 🎵     ║
  ║    Port: ${PORT}                        ║
  ║    http://localhost:${PORT}             ║
  ╚══════════════════════════════════════╝
  `);
});

module.exports = app;
