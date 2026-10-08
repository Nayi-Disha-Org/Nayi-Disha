import 'dotenv/config';
import pool from './config/db.js';

const setupDatabase = async () => {
  try {
    console.log("Connecting to Aiven Database...");
    
    // 1. Setup Users Table (Safely checks if it exists first)
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
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);`);
        await pool.query(`ALTER TABLE users DROP COLUMN IF EXISTS password_hash;`);
        
    console.log("✅ Verified 'users' table is ready.");
    // 2. Setup Experts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS experts (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);
    console.log("✅ Verified 'experts' table is ready.");

    // 3. Setup Counseling Sessions Table
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
    console.log("✅ Verified 'counseling_sessions' table is ready.");
    
    // 4. Setup ABC Behavioral Logs Table
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
    console.log("✅ Verified 'abc_logs' table is ready.");
    
    // 5. Setup Child Passports Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS child_passports (
        id SERIAL PRIMARY KEY,
        parent_id INT REFERENCES users(id) UNIQUE,
        child_name VARCHAR(255) NOT NULL,
        udid VARCHAR(100),
        age INT,
        emergency_contacts JSONB DEFAULT '[]',
        triggers JSONB DEFAULT '[]',
        strategies TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Verified 'child_passports' table is ready.");
    // Add this right below the child_passports CREATE TABLE block:
    await pool.query(`
      ALTER TABLE child_passports 
      ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10),
      ADD COLUMN IF NOT EXISTS allergies TEXT,
      ADD COLUMN IF NOT EXISTS communication_style VARCHAR(100),
      ADD COLUMN IF NOT EXISTS comfort_items TEXT;
    `);
    console.log("✅ Verified 'child_passports' has new extended columns.");
    // Add this right below the first ALTER TABLE child_passports block:
    await pool.query(`
      ALTER TABLE child_passports 
      ADD COLUMN IF NOT EXISTS low_demand_mode BOOLEAN DEFAULT FALSE;
    `);
    console.log("✅ Verified 'low_demand_mode' toggle added to passports.");
    // 6. Setup Voice Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS voice_logs (
        id SERIAL PRIMARY KEY,
        parent_id INT REFERENCES users(id),
        transcript TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General Note',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Verified 'voice_logs' table is ready.");
  
  // 7. Setup IEP Routines Table (Uses JSONB for Drag-and-Drop state)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS iep_routines (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) UNIQUE,
        routine_data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Verified 'iep_routines' table is ready.");

  // 8. Setup Caretaker Broadcasts Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS caretaker_broadcasts (
        id SERIAL PRIMARY KEY,
        caretaker_id INT REFERENCES users(id),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Verified 'caretaker_broadcasts' table is ready.");

    // 9. Seed Dummy Experts for Counseling Dropdown (Only if empty)
    const expCheck = await pool.query("SELECT COUNT(*) FROM experts");
    if (parseInt(expCheck.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO experts (full_name, specialty) VALUES 
        ('Dr. Anjali Desai', 'Behavioral Therapist'),
        ('Dr. Rohan Mehta', 'Speech Pathologist'),
        ('Dr. Priya Sharma', 'Occupational Therapist');
      `);
      console.log("✅ Seeded initial experts into database.");
    }
  
   // 10. Add Notification Preferences to Users Table
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_alerts BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS wearable_vibe BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS daily_summary BOOLEAN DEFAULT FALSE;
    `);
    console.log("✅ Verified user notification columns exist.");

  } catch (error) {
    console.error("❌ Error setting up tables:", error.message);
  } finally {
    pool.end(); 
  }
};


// Execute the safe setup
setupDatabase();
