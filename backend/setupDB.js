import pool from './config/db.js';

const setupTables = async () => {
  try {
    console.log("Connecting to Aiven Database...");
    
    // 1. Setup Users Table safely
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (email, role)
      );
    `);
    console.log("✅ 'users' table is ready (existing data preserved).");

    // 2. Setup Experts Table safely
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experts (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);
    console.log("✅ 'experts' table is ready (existing data preserved).");

    // 3. Setup Counseling Sessions Table safely
    await pool.query(`
      CREATE TABLE IF NOT EXISTS counseling_sessions (
        id SERIAL PRIMARY KEY,
        parent_id INT REFERENCES users(id),
        parent_name VARCHAR(255) NOT NULL,
        child_name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        expert_id INT REFERENCES experts(id),
        preferred_datetime TIMESTAMP NOT NULL,
        reason TEXT,
        mentor_notes TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'counseling_sessions' table is ready (existing data preserved).");
 
    // ABC Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS abc_logs (
        id SERIAL PRIMARY KEY,
        parent_id INT REFERENCES users(id),
        antecedent TEXT NOT NULL,
        behavior TEXT NOT NULL,
        consequence TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ 'abc_logs' table is ready (existing data preserved).");



  } catch (error) {
    console.error("❌ Error setting up tables:", error.message);
  } finally {
    pool.end(); 
  }
};

setupTables();