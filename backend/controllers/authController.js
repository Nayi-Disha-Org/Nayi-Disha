import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER A NEW USER ---
export const register = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (userCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // 2. Encrypt (Hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save the new user to Aiven PostgreSQL
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role",
      [fullName, email, hashedPassword, role || "parent"],
    );

    // 4. Generate a secure login token
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET || "nayi_disha_master_secret_2026",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// --- LOGIN EXISTING USER ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user in Aiven
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userResult.rows[0];

    // 2. Check if the password matches the encrypted one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate a secure login token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // <-- Fixed: using 'user' instead of 'newUser'
      process.env.JWT_SECRET || "nayi_disha_master_secret_2026",
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
