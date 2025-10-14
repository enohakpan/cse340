const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

// Check if DATABASE_URL is configured
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set!");
  console.error("Please set DATABASE_URL in your .env file or Render environment variables.");
} else {
  console.log("🔍 DATABASE_URL is set to:", process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  // Connection pool settings for Render PostgreSQL
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 600000, // 10 minutes
  max: 10,
  min: 1,
  acquireTimeoutMillis: 60000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
});

// Test database connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client:', err);
});

module.exports = {
  async query(text, params) {
    let retries = 3;
    
    while (retries > 0) {
      try {
        // Check if DATABASE_URL is configured before attempting query
        if (!process.env.DATABASE_URL) {
          throw new Error("DATABASE_URL environment variable is not configured");
        }
        
        const res = await pool.query(text, params);
        console.log("✅ Executed query successfully:", { text });
        return res;
      } catch (error) {
        console.error("❌ Database query failed:", { 
          text, 
          error: error.message,
          code: error.code,
          retriesLeft: retries - 1
        });
        
        // Check if this is a connection error that we should retry
        const shouldRetry = error.message.includes('Connection terminated') || 
                           error.message.includes('connection closed') ||
                           error.code === 'ECONNRESET' ||
                           error.code === 'ENOTFOUND';
        
        if (shouldRetry && retries > 1) {
          retries--;
          console.log(`🔄 Retrying database query... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          continue;
        }
        
        // Provide more helpful error messages
        if (error.code === 'ENOTFOUND') {
          console.error("🔍 DNS Resolution failed - check if database hostname is correct");
        } else if (error.code === 'ECONNREFUSED') {
          console.error("🔍 Connection refused - check if database is running and accessible");
        } else if (error.code === '28P01') {
          console.error("🔍 Authentication failed - check username and password");
        }
        
        throw error;
      }
    }
  },
  
  // Add a method to test database connectivity
  async testConnection() {
    try {
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Database connection test successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }
  }
};
