/**
 * ============================================
 * DATABASE SEED RUNNER
 * ============================================
 * Reads and executes the SQL files to set up
 * the database schema and seed data.
 * 
 * Usage: npm run seed
 * (Make sure MySQL is running first!)
 * ============================================
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function runSeed() {
  let connection;
  
  try {
    // Connect WITHOUT specifying a database first
    // (because the database might not exist yet)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true  // Allow running multiple SQL statements
    });

    console.log('✅ Connected to MySQL');

    // 1. Run schema.sql (creates database + tables)
    console.log('📦 Creating database schema...');
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await connection.query(schema);
    console.log('✅ Schema created!');

    // 2. Run seed.sql (inserts dummy data)
    console.log('🌱 Inserting seed data...');
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    await connection.query(seed);
    console.log('✅ Seed data inserted!');

    // 3. Run views.sql (creates views)
    console.log('👁️  Creating views...');
    const views = fs.readFileSync(path.join(__dirname, 'views.sql'), 'utf8');
    await connection.query(views);
    console.log('✅ Views created!');

    // Note: Triggers and procedures use DELIMITER which doesn't work
    // with mysql2. Run those manually in MySQL Workbench or CLI:
    //   mysql -u root -p < database/triggers.sql
    //   mysql -u root -p < database/procedures.sql
    console.log('');
    console.log('⚠️  NOTE: Triggers & Procedures need to be run manually:');
    console.log('   mysql -u root -p < database/triggers.sql');
    console.log('   mysql -u root -p < database/procedures.sql');
    console.log('   (These use DELIMITER which requires MySQL CLI)');

    console.log('');
    console.log('╔══════════════════════════════════════╗');
    console.log('║  🎵 VibeSync Database Ready! 🎵      ║');
    console.log('║  Tables: 11 | Views: 5               ║');
    console.log('║  Run: npm run dev                     ║');
    console.log('╚══════════════════════════════════════╝');

  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure MySQL server is running!');
    }
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check your DB_USER and DB_PASSWORD in .env file');
    }
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
}

runSeed();
