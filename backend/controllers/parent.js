/** @format */

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
  const { Email, Password } = req.body;
  console.log("req body", req.body);

  db.query(
    "SELECT * FROM ParentTable WHERE ParentEmail = ?",
    [Email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        console.log("Parent not found with email:", Email);
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const parent = results[0];

      bcrypt.compare(Password, parent.Password, (bcryptErr, match) => {
        if (bcryptErr) {
          console.log("Error comparing passwords:", bcryptErr);
          return res.status(500).json({ error: "Password comparison failed" });
        }

        if (!match) {
          console.log("Not found", match);
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
          { userId: parent.ParentID, role: "parent" },
          SECRET_KEY,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login successful",

          ParentID: parent.ParentID,
          ParentName: parent.ParentName,
          ParentEmail: parent.ParentEmail,
          role: "parent",
          token,
        });
      });
    }
  );
};

const handleUpdateParent = (req, res) => {
  const { id } = req.params; // Parent ID from the route
  const data = req.body;

  const {
    Password, // Optional
    ParentName,
    ParentEmail,
    ParentPhoneNo,
    ParentCNIC,
    Religion,
    Gender,
    Address,
  } = data;

  const fieldsToUpdate = {};

  if (ParentName) fieldsToUpdate.ParentName = ParentName;
  if (ParentEmail) fieldsToUpdate.ParentEmail = ParentEmail;
  if (ParentPhoneNo) fieldsToUpdate.ParentPhoneNo = ParentPhoneNo;
  if (ParentCNIC) fieldsToUpdate.ParentCNIC = ParentCNIC;
  if (Religion) fieldsToUpdate.Religion = Religion;
  if (Gender) fieldsToUpdate.Gender = Gender;
  if (Address) fieldsToUpdate.Address = Address;

  const updateParent = (hashedPassword = null) => {
    const updateFields = [];
    const updateValues = [];

    for (const key in fieldsToUpdate) {
      updateFields.push(`${key} = ?`);
      updateValues.push(fieldsToUpdate[key]);
    }

    if (hashedPassword) {
      updateFields.push("Password = ?");
      updateValues.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    const sql = `UPDATE ParentTable SET ${updateFields.join(
      ", "
    )} WHERE ParentID = ?`;
    updateValues.push(id);

    db.query(sql, updateValues, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to update parent", err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Parent not found" });
      }

      return res.status(200).json({ message: "Parent updated successfully" });
    });
  };

  if (Password && Password.trim() !== "") {
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Password hashing failed" });
      }
      updateParent(hashedPassword);
    });
  } else {
    updateParent(); // No password update
  }
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
  handleUpdateParent,
};
