import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // 1. Change this from 0 to 10 seconds.
  // Now Node.js politely closes idle connections BEFORE Aiven forces them closed.
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 2000, // Fails fast if Aiven is unresponsive
  max: 10, // Matches Aqua Cart's connectionLimit
});

pool.on("connect", () => {
  console.log("Connected to Aiven PostgreSQL Database");
});

pool.on("error", (err) => {
  // 2. REMOVE process.exit(-1)!
  // Just log the error and let the pool automatically recover.
  console.warn(
    "An idle client experienced an error (Auto-recovering):",
    err.message,
  );
});

export default pool;
