import pg from "pg";
import dotenv from "dotenv";

// 🔥 THE TIMEZONE FIX: Force the Postgres driver to treat all timestamps as UTC
pg.types.setTypeParser(1114, str => new Date(str + "Z"));

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // DECREASE THIS: Close connections after 10 seconds of inactivity
  // so Aiven doesn't kill them unexpectedly while we aren't looking.
  idleTimeoutMillis: 10000, 
  
  // INCREASE THIS: Give Aiven 10 seconds to establish the SSL connection
  connectionTimeoutMillis: 10000, 
  
  max: 4,
});

pool.on("connect", () => {
  console.log("Connected to Aiven PostgreSQL Database");
});

pool.on("error", (err) => {
  // Just log the error and let the pool automatically recover.
  console.warn(
    "An idle client experienced an error (Auto-recovering):",
    err.message,
  );
});

export default pool;