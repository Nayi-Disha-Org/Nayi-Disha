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

 // 5. Add a new ABC Log
export const addAbcLog = async (req, res) => {
  const { parent_id, antecedent, behavior, consequence } = req.body;
  try {
    const newLog = await pool.query(
      "INSERT INTO abc_logs (parent_id, antecedent, behavior, consequence) VALUES ($1, $2, $3, $4) RETURNING *",
      [parent_id, antecedent, behavior, consequence]
    );
    res.status(201).json(newLog.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    // TEMPORARY FIX: Send error.message to the frontend so you can see it
    res.status(500).json({ message: error.message });
  }
};
// 6. Fetch ABC Logs for a specific parent
export const getAbcLogs = async (req, res) => {
  const { parentId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM abc_logs WHERE parent_id = $1 ORDER BY created_at DESC",
      [parentId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch ABC logs" });
  }
};
// Delete ABC Log
export const deleteAbcLog = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM abc_logs WHERE id = $1", [id]);
    res.status(200).json({ message: "Log deleted" });
  } catch (error) {
    console.error("Delete ABC log error:", error);
    res.status(500).json({ message: "Failed to delete log." });
  }
};
// 7. Get Child Passport
export const getChildPassport = async (req, res) => {
  const { parentId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM child_passports WHERE parent_id = $1", [parentId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No passport found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to fetch passport" });
  }
};

// 8. Save or Update Child Passport
export const saveChildPassport = async (req, res) => {
  const { 
    parent_id, 
    child_name, 
    udid, 
    age, 
    emergency_contacts, 
    triggers, 
    strategies, 
    blood_group, 
    allergies, 
    communication_style, 
    comfort_items 
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO child_passports (parent_id, child_name, udid, age, emergency_contacts, triggers, strategies, blood_group, allergies, communication_style, comfort_items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (parent_id) 
       DO UPDATE SET 
          child_name = $2, 
          udid = $3, 
          age = $4, 
          emergency_contacts = $5, 
          triggers = $6, 
          strategies = $7, 
          blood_group = $8, 
          allergies = $9, 
          communication_style = $10, 
          comfort_items = $11, 
          updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        parent_id, 
        child_name, 
        udid, 
        age, 
        JSON.stringify(emergency_contacts), 
        JSON.stringify(triggers), 
        strategies, 
        blood_group, 
        allergies, 
        communication_style, 
        comfort_items
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ message: "Failed to save passport" });
  }
};
// 9. Add Voice Quick-Log
export const addVoiceLog = async (req, res) => {
  const { parent_id, transcript, category } = req.body;

  if (!parent_id || !transcript) {
    return res.status(400).json({ message: "Parent ID and transcript are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO voice_logs (parent_id, transcript, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [parent_id, transcript, category || 'General Note']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Voice log save error:", error);
    res.status(500).json({ message: "Failed to save voice log." });
  }
};

// 10. Get Voice Logs by Parent
export const getVoiceLogs = async (req, res) => {
  const { parentId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM voice_logs WHERE parent_id = $1 ORDER BY created_at DESC`,
      [parentId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Voice log fetch error:", error);
    res.status(500).json({ message: "Failed to fetch voice logs." });
  }
};
// 11. Delete Voice Log
export const deleteVoiceLog = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM voice_logs WHERE id = $1", [id]);
    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error("Delete voice log error:", error);
    res.status(500).json({ message: "Failed to delete log." });
  }
};
// 12. Toggle Low-Demand Mode
export const toggleLowDemandMode = async (req, res) => {
  const { parentId } = req.params;
  const { isActive } = req.body;
  
  try {
    // We use an UPSERT here. If the parent hasn't explicitly set up their child's passport yet, 
    // it will safely create a blank one and apply the Low-Demand Mode setting.
    const result = await pool.query(
      `INSERT INTO child_passports (parent_id, child_name, low_demand_mode)
       VALUES ($1, 'My Child', $2)
       ON CONFLICT (parent_id) 
       DO UPDATE SET low_demand_mode = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING low_demand_mode`,
      [parentId, isActive]
    );
    res.status(200).json({ isActive: result.rows[0].low_demand_mode });
  } catch (error) {
    console.error("Toggle Mode Error:", error);
    res.status(500).json({ message: "Failed to toggle Low-Demand Mode" });
  }
};
// 13. Get IEP Routine Layout
export const getIepRoutine = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT routine_data FROM iep_routines WHERE user_id = $1", [userId]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0].routine_data);
    } else {
      res.status(404).json({ message: "No routine found, use defaults" });
    }
  } catch (error) {
    console.error("Get IEP Error:", error);
    res.status(500).json({ message: "Failed to fetch routine" });
  }
};

// 14. Save IEP Routine Layout
export const saveIepRoutine = async (req, res) => {
  const { user_id, routine_data } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO iep_routines (user_id, routine_data)
       VALUES ($1, $2)
       ON CONFLICT (user_id) 
       DO UPDATE SET routine_data = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING routine_data`,
      [user_id, JSON.stringify(routine_data)]
    );
    res.status(200).json(result.rows[0].routine_data);
  } catch (error) {
    console.error("Save IEP Error:", error);
    res.status(500).json({ message: "Failed to save routine" });
  }
};
// 15. Add Caretaker Broadcast
export const addBroadcast = async (req, res) => {
  const { caretaker_id, message } = req.body;
  if (!caretaker_id || !message) return res.status(400).json({ message: "Missing fields" });

  try {
    const result = await pool.query(
      "INSERT INTO caretaker_broadcasts (caretaker_id, message) VALUES ($1, $2) RETURNING *",
      [caretaker_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({ message: "Failed to send broadcast" });
  }
};

// 16. Get Caretaker Broadcasts
export const getBroadcasts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM caretaker_broadcasts ORDER BY created_at DESC LIMIT 50");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Fetch Broadcasts Error:", error);
    res.status(500).json({ message: "Failed to fetch broadcasts" });
  }
};