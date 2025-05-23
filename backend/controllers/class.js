const db = require("../connection");

// add class
const handleAddClass = (req, res) => {
  const { ClassName } = req.body;

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
            classID: result.insertId,
          });
        }
      );
    }
  );
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

  db.query("DELETE FROM ClassTable WHERE ClassID = ?", [id], (err, result) => {
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
  handleGetAllClasses,
};
