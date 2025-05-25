/** @format */

const db = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";
const handleAdminSignup = async (req, res) => {
  const { Name, Password, CNIC, Email, PhoneNo } = req.body;
  if (!Name || !Password || !CNIC || !Email || !PhoneNo) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(
    "SELECT * FROM AdminTable WHERE Email = ?",
    [Email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 1) {
        return res
          .status(400)
          .json({ error: "Admin already registered with this email." });
      }

      // Proceed with creating the admin
      bcrypt.hash(Password, 10, (hashErr, Password) => {
        if (hashErr) {
          return res.status(500).json({ error: "Password hashing failed" });
        }

        db.query(
          "INSERT INTO AdminTable (Name, Email, Password, CNIC,PhoneNo) VALUES (?, ?, ?,?,?)",
          [Name, Email, Password, CNIC, PhoneNo],
          (insertErr, result) => {
            if (insertErr) {
              return res.status(500).json({ error: "Admin creation failed" });
            }

            res.status(201).json({
              message: "Admin created successfully",
              userId: result.insertId,
            });
          }
        );
      });
    }
  );
};

const handleAdminLogin = async (req, res) => {
  const { Email, Password } = req.body;
  if (!Email || !Password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "SELECT * FROM AdminTable WHERE Email = ?",
    [Email],
    async (err, results) => {
      if (err) {
        console.error("DB error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "User not found credentials" });
      }

      const admin = results[0];
      const match = await bcrypt.compare(Password, admin.Password);

      if (match) {
        const token = jwt.sign(
          { userId: admin.AdminID, role: "admin" },
          SECRET_KEY,
          {
            expiresIn: "5h",
          }
        );
        return res.json({ message: "Login successful", token });
      } else {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    }
  );
};

const handleGetAdmins = (req, res) => {
  db.query("SELECT * FROM AdminTable", (err, results) =>
    err ? res.status(500).json({ error: err }) : res.json(results)
  );
};

const handleDeleteAdmin = (req, res) => {
  db.query("DELETE FROM AdminTable WHERE ID = ?", [req.params.id], (err) =>
    err ? res.status(500).json({ error: err }) : res.json({ status: "deleted" })
  );
};

module.exports = {
  handleAdminSignup,
  handleAdminLogin,
  handleGetAdmins,
  handleDeleteAdmin,
};
