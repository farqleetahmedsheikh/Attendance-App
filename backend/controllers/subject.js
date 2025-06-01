/** @format */

const db = require("../connection");

const addSubject = (req, res) => {
  const { SubjectName, SubjectCode, ClassID } = req.body;

  // Step 1: Find ClassID from ClassName
  db.query(
    "SELECT * FROM SubjectTable WHERE SubjectCode = ?",
    [SubjectCode],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch ClassID" });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Subject Code already register" });
      }
      db.query(
        "INSERT INTO SubjectTable (SubjectName, SubjectCode, ClassID) VALUES (?, ?, ?)",
        [SubjectName, SubjectCode, Number(ClassID)],
        (insertErr, result) => {
          if (insertErr) {
            return res
              .status(500)
              .json({ error: "Failed to add subject", errMsg: insertErr });
          }

          res.status(201).json({
            message: "Subject added successfully",
            subjectId: result.insertId,
            SubjectCode,
            SubjectName,
            ClassID: Number(ClassID),
          });
        }
      );
    }
  );
};

const handleUpdateSubject = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Remove empty fields
  const fieldsToUpdate = {};
  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      fieldsToUpdate[key] = data[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const updateQuery = [];
  const updateValues = [];

  for (const key in fieldsToUpdate) {
    updateQuery.push(`${key} = ?`);
    updateValues.push(fieldsToUpdate[key]);
  }

  const sql = `UPDATE SubjectTable SET ${updateQuery.join(
    ", "
  )} WHERE SubjectID = ?`;
  updateValues.push(id);

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error("Subject Update Error:", err);
      return res
        .status(500)
        .json({ error: "Failed to update subject", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Subject not found" });
    }

    return res
      .status(200)
      .json({ message: "Subject updated successfully", data: updateValues });
  });
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
  handleUpdateSubject,
  deleteSubject,
};
