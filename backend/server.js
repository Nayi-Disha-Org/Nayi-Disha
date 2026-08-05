import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"; // <-- UNCOMMENTED

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Force the database connection to open and test itself
pool.query("SELECT NOW()", (err, res) => {
  if (err) console.error("Error connecting to database:", err.stack);
});

// Routes
app.use("/api/auth", authRoutes); // <-- UNCOMMENTED

app.get("/api/status", (req, res) => {
  res.json({ message: "Nayi Disha API is running smoothly!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
