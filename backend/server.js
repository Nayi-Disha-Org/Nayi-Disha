import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Force the database connection to open and test itself
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Error connecting to database:", err.stack);
});

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/status", (req, res) => {
  res.json({ message: "Nayi Disha API is running smoothly!" });
});

// rev: keep-awake ping for uptimerobot (prevents render sleep and keeps aiven db pool warm)
app.get("/keep-awake", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send("Render and Aiven PostgreSQL are both awake!");
  } catch (err) {
    console.error(
      "Database connection dropped, but ping caught it:",
      err.message,
    );
    res.status(500).send("Database sleeping.");
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
