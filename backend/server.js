import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Self-healing: if Aiven has powered the free database off, switch it back on.
//
// Add these three environment variables on Render (never commit them):
//   AIVEN_TOKEN    - personal API token from the Aiven console
//   AIVEN_PROJECT  - Aiven project name
//   AIVEN_SERVICE  - name of the PostgreSQL service
//
// If any of them is missing, this function does nothing.
// ---------------------------------------------------------------------------
let lastPowerOnAttempt = 0;
const POWER_ON_COOLDOWN_MS = 10 * 60 * 1000; // at most one attempt per 10 min

async function powerOnAivenIfNeeded() {
  const { AIVEN_TOKEN, AIVEN_PROJECT, AIVEN_SERVICE } = process.env;
  if (!AIVEN_TOKEN || !AIVEN_PROJECT || !AIVEN_SERVICE) return;
  if (Date.now() - lastPowerOnAttempt < POWER_ON_COOLDOWN_MS) return;
  lastPowerOnAttempt = Date.now();

  try {
    const response = await fetch(
      `https://api.aiven.io/v1/project/${AIVEN_PROJECT}/service/${AIVEN_SERVICE}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${AIVEN_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ powered: true }),
      },
    );
    console.log("Aiven power-on requested, HTTP status:", response.status);
  } catch (error) {
    console.warn("Aiven power-on request failed:", error.message);
  }
}

// Force the database connection to open and test itself
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    powerOnAivenIfNeeded();
  }
});

// Internal heartbeat: keeps the Aiven connection busy while Render is awake
setInterval(
  async () => {
    try {
      await pool.query("SELECT 1");
    } catch (error) {
      console.warn("Heartbeat missed:", error.message);
      powerOnAivenIfNeeded();
    }
  },
  4 * 60 * 1000,
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);

app.get("/api/status", (req, res) => {
  res.json({ message: "Nayi Disha API is running smoothly!" });
});

// Keep-awake ping for UptimeRobot.
// NOTE: this route is at the ROOT, not under /api. The UptimeRobot URL must be
//   https://<your-service>.onrender.com/keep-awake
app.get("/keep-awake", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send("Render and Aiven PostgreSQL are both awake!");
  } catch (err) {
    console.error(
      "Database connection dropped, but ping caught it:",
      err.message,
    );
    powerOnAivenIfNeeded();
    res.status(500).send("Database sleeping.");
  }
});

// GLOBAL SAFETY NET: Catches fatal bugs before they crash Render
app.use((err, req, res, next) => {
  console.error("Critical Unhandled Error:", err.stack);
  res.status(500).json({ message: "An internal server error occurred." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
