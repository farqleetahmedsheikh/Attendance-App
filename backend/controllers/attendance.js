const db = require("../connection");

const handleGetAttendance = async (req, res) => {
  const { classId, subjectId, fromDate, toDate } = req.body;

  if (!classId || !subjectId || !fromDate || !toDate) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const query = `
      SELECT a.*, s.Std_Name AS studentName
      FROM AttendanceTable a
      JOIN Std_Table s ON a.StudentID = s.Std_ID
      WHERE s.ClassID = ? 
        AND a.SubjectID = ? 
        AND a.AttendanceDate BETWEEN ? AND ?
      ORDER BY a.AttendanceDate
    `;

    db.query(query, [classId, subjectId, fromDate, toDate], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleGetAttendance,
};
