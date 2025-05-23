const db = require("../connection");

const addSubject = (req, res) => {
  const { SubjectName, SubjectCode, ClassName } = req.body;

  // Step 1: Find ClassID from ClassName
  db.query(
    "SELECT ClassID FROM ClassTable WHERE ClassName = ?",
    [ClassName],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch ClassID" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "Class not found" });
      }

      const ClassID = results[0].ClassID;

      // Step 2: Insert subject with found ClassID
      db.query(
        "SELECT * FROM SubjectTable WHERE SubjectCode = ?",
        [SubjectCode],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Failed to fetch ClassID" });
          }

          if (results.length > 0) {
            return res
              .status(400)
              .json({ error: "Subject Code already register" });
          }
          db.query(
            "INSERT INTO SubjectTable (SubjectName, SubjectCode, ClassID) VALUES (?, ?, ?)",
            [SubjectName, SubjectCode, ClassID],
            (insertErr, result) => {
              if (insertErr) {
                return res
                  .status(500)
                  .json({ error: "Failed to add subject", errMsg: insertErr });
              }

              res.status(201).json({
                message: "Subject added successfully",
                subjectId: result.insertId,
              });
            }
          );
        }
      );
    }
  );
};

// 🔍 Get all subjects
const getAllSubjects = (req, res) => {
  db.query("SELECT * FROM SubjectTable", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch subjects" });
    }
    res.status(200).json(results);
  });
};

// ❌ Delete subject by ID
const deleteSubject = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM SubjectTable WHERE SubjectID = ?",
    [id],
    (err, result) => {
      if (err)
        return res.status(500).json({ error: "Failed to delete subject" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.status(200).json({ message: "Subject deleted successfully" });
    }
  );
};

module.exports = {
  addSubject,
  getAllSubjects,
  deleteSubject,
};
