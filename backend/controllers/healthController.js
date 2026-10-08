import pool from '../config/db.js';

// 1. Fetch Experts (instead of therapists)
export const getExperts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM experts WHERE is_active = TRUE ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch experts" });
  }
};

// 2. Book Counseling (Using Raj's new column names)
export const bookCounseling = async (req, res) => {
  const { parent_id, parent_name, child_name, category, expert_id, preferred_datetime, reason } = req.body;
  
  if (!parent_name || !child_name || !preferred_datetime || !reason || !category || !expert_id) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {
    const newSession = await pool.query(
      `INSERT INTO counseling_sessions 
      (parent_id, parent_name, child_name, category, expert_id, preferred_datetime, reason) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [parent_id || null, parent_name, child_name, category, expert_id, preferred_datetime, reason]
    );
    res.status(201).json({ message: "Session booked successfully", session: newSession.rows[0] });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to book session" });
  }
};

// 3. Fetch Sessions for Admin (Updated the JOIN to use 'experts' instead of 'therapists')
export const getCounselingSessions = async (req, res) => {
  try {
    const query = `
      SELECT cs.*, e.full_name as expert_name 
      FROM counseling_sessions cs
      LEFT JOIN experts e ON cs.expert_id = e.id
      ORDER BY cs.preferred_datetime ASC
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

// 4. Update Session Status/Notes (No changes needed here, just keeping it intact!)
export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { status, mentor_notes } = req.body;

  try {
    const result = await pool.query(
      "UPDATE counseling_sessions SET status = $1, mentor_notes = $2 WHERE id = $3 RETURNING *",
      [status, mentor_notes, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to update session" });
  }
};
// Fetch logs for the logged-in user
export const getAbcLogs = async (req, res) => {
  const { parent_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM abc_logs WHERE parent_id = $1 ORDER BY created_at DESC",
      [parent_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

// Save a new log
export const addAbcLog = async (req, res) => {
  const { parent_id, antecedent, behavior, consequence } = req.body;
  if (!parent_id || !antecedent || !behavior || !consequence) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {
    const newLog = await pool.query(
      "INSERT INTO abc_logs (parent_id, antecedent, behavior, consequence) VALUES ($1, $2, $3, $4) RETURNING *",
      [parent_id, antecedent, behavior, consequence]
    );
    res.status(201).json(newLog.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to save log" });
  }
};