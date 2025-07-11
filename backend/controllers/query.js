/** @format */

// controllers/queryController.js
const db = require("../connection");

// --- QUERY SUBMISSION ---
const submitQuery = (req, res) => {
  const { Subject, Message, role, UserID, TeacherID } = req.body;

  if (!Subject || !Message || !role || !UserID || !TeacherID) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const parentId = role === "parent" ? UserID : null;

  const query = `
    INSERT INTO Queries (Subject, Message, ParentID, TeacherID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [Subject, Message, parentId, TeacherID], (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      return res.status(500).json({ error: "Database error." });
    }

    return res.status(200).json({
      message: "Query submitted successfully",
      queryId: result.insertId,
    });
  });
};

// --- GET ALL QUERIES ---
const getAllQueries = (req, res) => {
  const query = `
    SELECT * FROM Queries
    ORDER BY 
      CASE WHEN Status = 'Unread' THEN 0 ELSE 1 END,
      CreatedAt DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching queries:", err);
      return res.status(500).json({ error: "Failed to fetch queries" });
    }

    return res.status(200).json(results);
  });
};

// --- MARK ALL AS READ ---
const markAllAsRead = (req, res) => {
  const userID = req.headers.userid; // Get UserID from headers (case-insensitive)
  const role = req.headers.role; // Get role from headers
  
  if (role !== "teacher") {
    return res.status(200);
  }
  console.log("Marking all queries as read for TeacherID:", userID, role);
  const query = `UPDATE Queries SET Status = 'Read' WHERE Status = 'Unread' and TeacherID = ?`;

  db.query(query, [userID], (err) => {
    if (err) {
      console.error("Error marking queries as read:", err);
      return res.status(500).json({ error: "Failed to update status" });
    }

    return res
      .status(200)
      .json({ message: "All unread queries marked as read" });
  });
};

// --- GET UNREAD COUNT ---
const getUnreadCount = (req, res) => {
  const userID = req.headers.userid; // Get TeacherID from headers (case-insensitive)
  console.log("Getting unread count for TeacherID:", userID);
  const query = `SELECT COUNT(*) AS unreadCount FROM Queries WHERE Status = 'Unread' and TeacherID = ?`;

  db.query(query, [userID], (err, result) => {
    if (err) {
      console.error("Error getting unread count:", err);
      return res.status(500).json({ error: "Failed to fetch unread count" });
    }

    return res.status(200).json(result[0]);
  });
};

// --- REPLY TO QUERY ---
const submitReply = (req, res) => {
  const { QueryID, SenderRole, SenderID, Message } = req.body;
  console.log("Received reply data:", req.body);

  if (!QueryID || !SenderRole || !SenderID || !Message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const query = `
    INSERT INTO QueryMessages (QueryID, SenderRole, SenderID, Message)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [QueryID, SenderRole, SenderID, Message], (err, result) => {
    if (err) {
      console.error("Error inserting reply:", err);
      return res.status(500).json({ error: "Failed to submit reply" });
    }

    return res.status(200).json({ message: "Reply submitted successfully" });
  });
};

// --- GET REPLIES FOR QUERY ---
const getRepliesByQueryId = (req, res) => {
  const { queryId } = req.params;

  const query = `
    SELECT * FROM QueryMessages
    WHERE QueryID = ?
    ORDER BY CreatedAt ASC
  `;

  db.query(query, [queryId], (err, results) => {
    if (err) {
      console.error("Error fetching replies:", err);
      return res.status(500).json({ error: "Failed to fetch replies" });
    }

    return res.status(200).json(results);
  });
};

module.exports = {
  submitQuery,
  getAllQueries,
  markAllAsRead,
  getUnreadCount,
  submitReply,
  getRepliesByQueryId,
};
