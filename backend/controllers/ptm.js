/** @format */

const db = require("../connection");

// Add PTM
const handleAddPTM = (req, res) => {
  const { PTMDate, PTMTime, Description, ParentID, TeacherID } = req.body;

  if (!PTMDate || !PTMTime || !Description || !ParentID || !TeacherID) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `
  INSERT INTO PTM_Table (PTMDate, PTMTime, Description, ParentID, TeacherID)
  VALUES (?, ?, ?, ?, ?)
`;
  db.query(
    query,
    [PTMDate, PTMTime, Description, ParentID, TeacherID],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add PTM", err });

      res.status(201).json({
        message: "PTM added successfully",
        ptm: {
          PTMID: result.insertId,
          PTMDate,
          PTMTime,
          Description,
          ParentID,
          TeacherID,
        },
      });
    }
  );
};

const handleUpdatePTM = (req, res) => {
  const { id } = req.params;
  const { PTMDate, PTMTime, Description } = req.body; // First, get the existing data

  db.query("SELECT * FROM PTM_Table WHERE PTMID = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error", err });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "PTM not found" });
    }

    const existingPTM = results[0]; // Fallback to existing values if fields are empty

    const updatedPTMDate =
      PTMDate && PTMDate.trim() !== "" ? PTMDate : existingPTM.PTMDate;
    const updatedPTMTime =
      PTMTime && PTMTime.trim() !== "" ? PTMTime : existingPTM.PTMTime;
    const updatedDescription =
      Description && Description.trim() !== ""
        ? Description
        : existingPTM.Description; // Update query

    const updateQuery = `
  UPDATE PTM_Table
  SET PTMDate = ?, PTMTime = ?, Description = ?
  WHERE PTMID = ?
`;

    const updateValues = [
      updatedPTMDate,
      updatedPTMTime,
      updatedDescription,
      id,
    ];

    db.query(updateQuery, updateValues, (updateErr, updateResult) => {
      if (updateErr) {
        return res
          .status(500)
          .json({ error: "Failed to update PTM", updateErr });
      }

      res.status(200).json({ message: "PTM updated successfully" });
    });
  });
};

// Get all PTMs with parent and teacher names
const handleGetAllPTMs = (req, res) => {
  const query = `
    SELECT P.PTMID, P.PTMDate, P.Description,P.PTMTime,
           T.TeacherID, T.TeacherName,
           Pa.ParentID, Pa.ParentName
    FROM PTM_Table P
    JOIN TeacherTable T ON P.TeacherID = T.TeacherID
    JOIN ParentTable Pa ON P.ParentID = Pa.ParentID
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch PTMs" });
    res.status(200).json(results);
  });
};

// Delete PTM
const handleDeletePTM = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM PTM_Table WHERE PTMID = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete PTM" });

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "PTM not found" });

    res.status(200).json({ message: "PTM deleted successfully" });
  });
};

module.exports = {
  handleAddPTM,
  handleGetAllPTMs,
  handleDeletePTM,
  handleUpdatePTM,
};
