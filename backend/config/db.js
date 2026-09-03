import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // INCREASE THIS: Keep the connection open for 10 minutes
  idleTimeoutMillis: 600000,
  connectionTimeoutMillis: 2000,
  max: 4,
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
