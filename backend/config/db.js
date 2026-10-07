import pg from "pg";
import dotenv from "dotenv";

// 🔥 THE TIMEZONE FIX: Force the Postgres driver to treat all timestamps as UTC
pg.types.setTypeParser(1114, str => new Date(str + "Z"));

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  idleTimeoutMillis: 600000,
  connectionTimeoutMillis: 10000, // INCREASED: Gives Aiven 10 seconds to boot up
  keepAlive: true, // ADDED: Detects dead connections sooner
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