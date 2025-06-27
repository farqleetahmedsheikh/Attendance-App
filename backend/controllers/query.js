// controllers/queryController.js
const db = require("../connection");

const submitQuery = (req, res) => {
  const { Subject, Message, role, UserID } = req.body;

  if (!Subject || !Message || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Prepare insert values
  const parentId = role === "parent" ? UserID : null;
  const studentId = role === "student" ? UserID : null;
  const query = `
    INSERT INTO Queries (Subject, Message, ParentID, StudentID)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [Subject, Message, parentId, studentId], (err, result) => {
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

const markAllAsRead = (req, res) => {
  const query = `
    UPDATE Queries
    SET Status = 'Read'
    WHERE Status = 'Unread'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error marking queries as read:", err);
      return res.status(500).json({ error: "Failed to update status" });
    }

    return res
      .status(200)
      .json({ message: "All unread queries marked as read" });
  });
};

const getUnreadCount = (req, res) => {
  const query = `
    SELECT COUNT(*) AS unreadCount FROM Queries WHERE Status = 'Unread'
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error getting unread count:", err);
      return res.status(500).json({ error: "Failed to fetch unread count" });
    }

    return res.status(200).json(result[0]);
  });
};

module.exports = { submitQuery, getAllQueries, markAllAsRead, getUnreadCount };
