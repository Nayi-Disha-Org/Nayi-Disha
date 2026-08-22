const resetTables = async () => {
  try {
    console.log("Connecting to Aiven Database...");
    
    // 1. Setup Users Table
    await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);
    console.log("🗑️ Old restrictive table removed.");

    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (email, role)
      );
    `);
    console.log("✅ Success! 'users' table is ready.");

    // 2. Setup Experts Table (Strictly empty, no dummy data)
    await pool.query(`DROP TABLE IF EXISTS experts CASCADE;`);
    await pool.query(`
      CREATE TABLE experts (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);
    console.log("✅ Success! 'experts' table is ready.");

    // 3. Setup Counseling Sessions Table
    await pool.query(`DROP TABLE IF EXISTS counseling_sessions CASCADE;`);
    await pool.query(`
      CREATE TABLE counseling_sessions (
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
    console.log("✅ Success! 'counseling_sessions' table is ready.");

  } catch (error) {
    console.error("❌ Error creating table:", error.message);
  } finally {
    pool.end(); 
  }
};