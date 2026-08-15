import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

// Connect to Aiven using your .env file
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const resetTables = async () => {
  try {
    console.log("Connecting to Aiven Database...");
    
    // 1. Drop the old table to remove the strict 'UNIQUE(email)' constraint
    await pool.query(`DROP TABLE IF EXISTS users;`);
    console.log("🗑️ Old restrictive table removed.");

    // 2. Create the new table with Role Isolation
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (email, role) -- THIS IS THE MAGIC FIX!
      );
    `);
    
    console.log("✅ Success! The new Role-Isolated 'users' table is ready.");
  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  } finally {
    pool.end(); // Close the connection
  }
};

resetTables();