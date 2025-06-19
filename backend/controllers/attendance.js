const db = require("../connection");

const handleMarkAttendance = async (req, res) => {
  const { studentId, subjectId, status } = req.body;

  console.log("Marking attendance:", req.body);

  if (!studentId || !subjectId || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const date = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
  try {
    // First, check if attendance already exists
    const checkQuery = `
      SELECT * FROM AttendanceTable 
      WHERE StudentID = ? AND SubjectID = ? AND AttendanceDate = ?
    `;

    db.query(checkQuery, [studentId, subjectId, date], (err, rows) => {
      if (err) {
        console.error("Check error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (rows.length > 0) {
        // Update existing record
        const updateQuery = `
          UPDATE AttendanceTable 
          SET IsPresent = ? 
          WHERE StudentID = ? AND SubjectID = ? AND AttendanceDate = ?
        `;

        db.query(
          updateQuery,
          [status, studentId, subjectId, date],
          (err, result) => {
            if (err) {
              console.error("Update error:", err);
              return res
                .status(500)
                .json({ error: "Failed to update attendance" });
            }
            res.status(200).json({ message: "Attendance updated" });
          }
        );
      } else {
        // Insert new record
        const insertQuery = `
          INSERT INTO AttendanceTable (StudentID, SubjectID, IsPresent, AttendanceDate)
          VALUES (?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [studentId, subjectId, status, date],
          (err, result) => {
            if (err) {
              console.error("Insert error:", err);
              return res
                .status(500)
                .json({ error: "Failed to insert attendance" });
            }
            res.status(201).json({ message: "Attendance marked" });
          }
        );
      }
    });
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const handleGetAttendance = (req, res) => {
  const { classId, subjectId, fromDate, toDate, studentId } = req.body;

  if (!classId || !subjectId || !fromDate || !toDate) {
    return res.status(400).json({ error: "Missing required filters" });
  }

  let query = `
    SELECT a.*, s.Std_Name
    FROM AttendanceTable a
    JOIN Std_Table s ON a.StudentID = s.Std_ID
    WHERE s.ClassID = ?
      AND a.SubjectID = ?
      AND a.AttendanceDate BETWEEN ? AND ?
  `;
  const values = [classId, subjectId, fromDate, toDate];

  if (studentId) {
    query += " AND s.Std_ID = ?";
    values.push(studentId);
  }

  query += " ORDER BY a.AttendanceDate ASC";

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error fetching attendance:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ attendance: result });
  });
};

module.exports = { handleGetAttendance };

module.exports = { handleMarkAttendance, handleGetAttendance };
