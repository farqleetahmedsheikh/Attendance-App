/** @format */

const bcrypt = require("bcrypt");
const db = require("../connection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Replace with your actual secret key
// Signup student
const handleAddStudent = (req, res) => {
  const {
    Std_Name,
    Std_Email,
    Std_B_Form,
    Std_DOB,
    Batch,
    Session,
    RollNo,
    Password,
    Status,
    ClassID,
    Religion,
    ParentID,
    Gender,
    Address,
  } = req.body;

  // Validation
  if (
    !Std_Name ||
    !Std_Email ||
    !Password ||
    !Std_B_Form ||
    !Std_DOB ||
    !Batch ||
    !Session ||
    !RollNo ||
    !ClassID ||
    !Religion ||
    !ParentID ||
    !Gender ||
    !Address
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Step 1: Check if student already exists
  db.query(
    "SELECT * FROM Std_Table WHERE Std_Email = ? OR Std_B_Form = ? OR RollNo = ?",
    [Std_Email, Std_B_Form, RollNo],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({
          error: "Student already registered with these credentials",
        });
      }

      // Step 2: Hash the password
      bcrypt.hash(Password, 10, (hashErr, hashPassword) => {
        if (hashErr) {
          return res.status(500).json({ error: "Password hashing failed" });
        }

        // Step 3: Insert student directly using provided ClassID
        db.query(
          `INSERT INTO Std_Table (
            Std_Name, Std_Email, Std_B_Form, Std_DOB, Batch, Session, RollNo,
             Password,  Status, ClassID, Religion,ParentID, Gender, Address
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            Std_Name,
            Std_Email,
            Std_B_Form,
            Std_DOB,
            Batch,
            Session,
            RollNo,
            hashPassword,
            Status,
            Number(ClassID),
            Religion,
            ParentID,
            Gender,
            Address,
          ],
          (insertErr, result) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ error: "Adding Student failed", errMsg: insertErr });
            }
            return res.status(201).json({
              message: "Student added successfully",
              student: {
                Std_ID: result.insertId,
                Std_Name,
                Std_Email,
                RollNo,
                Status,
                ClassID: Number(ClassID),
                Gender,
                ParentID,
              },
            });
          }
        );
      });
    }
  );
};

// ✅ Login student
const handleStudentLogin = (req, res) => {
  const { Email, Password } = req.body;

  db.query(
    "SELECT * FROM Std_Table WHERE Std_Email = ?",
    [Email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const student = results[0];

      bcrypt.compare(Password, student.Password, (bcryptErr, match) => {
        if (bcryptErr)
          return res.status(500).json({ error: "Password comparison failed" });

        if (!match)
          return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign(
          { userId: student.ID, role: "student" },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          message: "Login successful",
          student,
          token,
          userId: student.Std_ID,
          role: "student",
        });
      });
    }
  );
};

const handleUpdateStudent = (req, res) => {
  const { id } = req.params;
  const data = req.body;

  // Remove empty fields (null, undefined, or empty string)
  const fieldsToUpdate = {};
  const isValidDate = (d) => {
    return d && !isNaN(new Date(d).getTime());
  };

  for (const key in data) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
      if (
        (key === "Std_DOB" || key === "Registration_Date") &&
        isValidDate(data[key])
      ) {
        // Format both to YYYY-MM-DD
        const date = new Date(data[key]);
        fieldsToUpdate[key] = date.toISOString().split("T")[0]; // Keep only the date part
      } else {
        fieldsToUpdate[key] = data[key];
      }
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }

  const updateQuery = [];
  const updateValues = [];

  const updateDatabase = (finalFields) => {
    for (const key in finalFields) {
      updateQuery.push(`${key} = ?`);
      updateValues.push(finalFields[key]);
    }

    const sql = `UPDATE Std_Table SET ${updateQuery.join(
      ", "
    )} WHERE Std_ID = ?`;
    updateValues.push(id);

    db.query(sql, updateValues, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Failed to update student", details: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json({ message: "Student updated successfully" });
    });
  };

  // If password is included, hash it before update
  if (fieldsToUpdate.Password) {
    bcrypt.hash(fieldsToUpdate.Password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        return res.status(500).json({ error: "Password hashing failed" });
      }
      fieldsToUpdate.Password = hashedPassword;
      updateDatabase(fieldsToUpdate);
    });
  } else {
    updateDatabase(fieldsToUpdate);
  }
};

// ✅ Show all students
const handleGetAllStudents = (req, res) => {
  db.query("SELECT * FROM Std_Table", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch students" });
    }
    res.status(200).json(results);
  });
};

// ❌ Delete student by ID
const handleDeleteStudent = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Std_Table WHERE Std_ID = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete student" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  });
};

module.exports = {
  handleStudentLogin,
  handleAddStudent,
  handleDeleteStudent,
  handleGetAllStudents,
  handleUpdateStudent,
};
