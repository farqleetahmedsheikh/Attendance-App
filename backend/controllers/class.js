/** @format */

const db = require("../connection");

// add class
const handleAddClass = (req, res) => {
  const { ClassName } = req.body;
  console.log("Adding class:", ClassName);

  db.query(
    "SELECT * FROM ClassTable WHERE ClassName = ?",
    [ClassName],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({ error: "Class already registered" });
      }

      db.query(
        `INSERT INTO ClassTable (
          ClassName
        ) VALUES (?)`,
        [ClassName],
        (insertErr, result) => {
          if (insertErr)
            return res
              .status(500)
              .json({ error: "Class Added failed", errMsg: insertErr });

          res.status(201).json({
            message: "Class Added successfully",
            ClassID: result.insertId,
            ClassName: ClassName,
          });
        }
      );
    }
  );
};

// Handle update class
const handleUpdateClass = (req, res) => {
  const { id } = req.params; // Class ID from the route
  const data = req.body;

  const { ClassName } = data;

  // Only allow updates to specific fields
  const fieldsToUpdate = {};

  if (ClassName) fieldsToUpdate.ClassName = ClassName;

  // If no valid fields provided
  if (Object.keys(fieldsToUpdate).length === 0) {
    console.log("No valid fields provided for update");
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  const updateFields = [];
  const updateValues = [];

  for (const key in fieldsToUpdate) {
    updateFields.push(`${key} = ?`);
    updateValues.push(fieldsToUpdate[key]);
  }

  const sql = `UPDATE ClassTable SET ${updateFields.join(
    ", "
  )} WHERE ClassID = ?`;
  updateValues.push(id);

  db.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update class", err });
    }

    if (result.affectedRows === 0) {
      console.log("Class not found for update");
      return res.status(404).json({ error: "Class not found" });
    }

    return res.status(200).json({ message: "Class updated successfully" });
  });
};

// Show all classes
const handleGetAllClasses = (req, res) => {
  db.query(
    "SELECT * FROM ClassTable ORDER BY CAST(ClassName AS UNSIGNED) ASC",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch classes" });
      }
      res.status(200).json(results);
    }
  );
};

// Delete class by class id
const handleDeleteClass = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "Class ID is required" });
  }
  db.query("DELETE FROM ClassTable WHERE ClassID = ?", [id], (err, result) => {
    console.log("Delete result:", result);
    if (err) {
      return res.status(500).json({ error: "Failed to delete class" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "class not found" });
    }

    res.status(200).json({ message: "class deleted successfully" });
  });
};

module.exports = {
  handleAddClass,
  handleDeleteClass,
  handleUpdateClass,
  handleGetAllClasses,
};
