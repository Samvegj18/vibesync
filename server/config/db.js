/**
 * ============================================
 * DATABASE CONNECTION - MySQL Configuration
 * ============================================
 * 
 * This file creates a connection pool to MySQL.
 * A connection pool reuses database connections
 * instead of creating new ones for each query,
 * which improves performance.
 * 
 * We use mysql2/promise for async/await support.
 * ============================================
 */

const mysql = require('mysql2/promise');

// Create a connection pool
// Pool manages multiple connections efficiently
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vibesync',
  port: process.env.DB_PORT || 3306,
  
  // Pool configuration
  waitForConnections: true,  // Wait if all connections are busy
  connectionLimit: 10,       // Maximum 10 simultaneous connections
  queueLimit: 0              // Unlimited queue size
});

// Test the database connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully!');
    connection.release(); // Release connection back to pool
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Make sure MySQL is running and the database "vibesync" exists.');
    console.log('💡 Run the schema.sql file first to create the database.');
  }
})();

module.exports = pool;
