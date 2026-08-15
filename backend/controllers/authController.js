import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- REGISTER A NEW USER ---
export const register = async (req, res) => {
  try {
    // 1. Grab all possible variations of the name variable sent from the frontend
    const { full_name, fullName, name, email, password, role } = req.body;
    
    // 2. Safely capture the name no matter which way it was spelled
    const finalName = full_name || fullName || name;
    
    // 3. We expect the frontend to pass the role (parent, caretaker, admin)
    const assignedRole = role || "parent";

    // 4. Validation
    if (!finalName) {
      return res.status(400).json({ message: "Full Name is required. Please check your frontend form!" });
    }
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    // 5. Check if user already exists FOR THIS SPECIFIC DASHBOARD (Role Isolation)
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2", 
      [email, assignedRole]
    );
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ 
        message: `You already have an account for the ${assignedRole} dashboard. Please Sign In.` 
      });
    }

    // 6. Encrypt (Hash) the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7. Save the new user to Aiven PostgreSQL
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, role",
      [finalName, email, hashedPassword, assignedRole]
    );

    // 8. Generate a secure login token
    const token = jwt.sign(
      { id: newUser.rows[0].id, role: newUser.rows[0].role },
      process.env.JWT_SECRET || "nayi_disha_master_secret_2026",
      { expiresIn: "7d" }
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
  const { email, password, role } = req.body;
  const attemptedRole = role || "parent";

  try {
    // 1. Try to find the user in Aiven FOR THIS SPECIFIC DASHBOARD (Role Isolation)
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND role = $2",
      [email, attemptedRole]
    );

    // If no exact match is found (Wrong email OR wrong dashboard)
    if (userResult.rows.length === 0) {
      
      // SMART CHECK: Let's see if they exist in a DIFFERENT dashboard
      const emailCheck = await pool.query("SELECT role FROM users WHERE email = $1", [email]);
      
      if (emailCheck.rows.length > 0) {
        // Dynamic error: Tell parents to sign up, tell staff to contact admin
        const errorMsg = attemptedRole === "parent" 
          ? "Access Denied. Please sign up first." 
          : "Access Denied. Please contact the system administrator to request an account.";
        
        return res.status(403).json({ message: errorMsg });
      }
      
      // If the email doesn't exist anywhere at all:
      const notFoundMsg = attemptedRole === "parent"
        ? "Account not found. Please sign up first."
        : "Account not found. Please contact the system administrator.";
        
      return res.status(400).json({ message: notFoundMsg });
    }

    const user = userResult.rows[0];

    // 2. Check if the password matches the encrypted one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password. Please try again." });
    }

    // 3. Generate a secure login token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "nayi_disha_master_secret_2026",
      { expiresIn: "7d" }
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