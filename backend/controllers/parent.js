const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../connection");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Replace with your actual secret key

// ✅ Add Parent
const handleAddParent = (req, res) => {
  const {
    ParentName,
    ParentEmail,
    Password,
    ParentPhoneNo,
    ParentCNIC,
    Religion,
    Gender,
    Address,
  } = req.body;

  if (
    !ParentName ||
    !ParentEmail ||
    !Password ||
    !ParentPhoneNo ||
    !ParentCNIC ||
    !Religion ||
    !Gender ||
    !Address
  ) {
    console.log("Validation failed: Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM ParentTable WHERE ParentEmail = ? OR ParentCNIC = ?",
    [ParentEmail, ParentCNIC],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "Parent already registered with this email or CNIC" });
      }

      bcrypt.hash(Password, 10, (hashErr, Password) => {
        if (hashErr)
          return res.status(500).json({ error: "Password hashing failed" });

        const insertQuery = `
          INSERT INTO ParentTable (
            ParentName, ParentEmail, Password, ParentPhoneNo,
            ParentCNIC,Religion , Gender, Address
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [
            ParentName,
            ParentEmail,
            Password,
            ParentPhoneNo,
            ParentCNIC,
            Religion,
            Gender,
            Address,
          ],
          (insertErr, result) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ error: "Failed to add parent", errMsg: insertErr });
            }
            res.status(201).json({
              message: "Parent added successfully",
              ParentId: result.insertId,
              ParentName,
              ParentEmail,
              ParentPhoneNo,
              Address,
            });
          }
        );
      });
    }
  );
};

// ✅ Login Parent
const handleParentLogin = (req, res) => {
  const { ParentEmail, Password } = req.body;

  db.query(
    "SELECT * FROM ParentTable WHERE ParentEmail = ?",
    [ParentEmail],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const parent = results[0];

      bcrypt.compare(Password, parent.Password, (bcryptErr, match) => {
        if (bcryptErr)
          return res.status(500).json({ error: "Password comparison failed" });

        if (!match)
          return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
          { userId: parent.ParentID, role: "parent" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login successful",
          parent: {
            ParentID: parent.ParentID,
            ParentName: parent.ParentName,
            ParentEmail: parent.ParentEmail,
          },
          token,
        });
      });
    }
  );
};

// ✅ Get All Parents
const handleGetAllParents = (req, res) => {
  db.query("SELECT * FROM ParentTable", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch parents" });
    }
    return res.status(200).json(results);
  });
};

// ✅ Delete Parent
const handleDeleteParent = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM ParentTable WHERE ParentID = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete parent" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Parent not found" });
      }

      return res.status(200).json({ message: "Parent deleted successfully" });
    }
  );
};

module.exports = {
  handleAddParent,
  handleParentLogin,
  handleGetAllParents,
  handleDeleteParent,
};
