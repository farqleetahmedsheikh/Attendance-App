const bcrypt = require("bcrypt");
const db = require("../connection");

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
    GuardianContact,
    Password,
    Type,
    Status,
    ClassID,
    Religion,
    Gender,
    Address,
    GuardianName,
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
    !GuardianContact ||
    !Type ||
    !ClassID ||
    !Religion ||
    !Gender ||
    !Address ||
    !GuardianName
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Step 1: Check if student already exists
  db.query(
    "SELECT * FROM Std_Table WHERE Std_Email = ? OR Std_B_Form = ? OR RollNo = ?",
    [Std_Email, Std_B_Form, RollNo],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({
          error: "Student already registered with these credentials",
        });
      }

      // Step 2: Hash the password
      bcrypt.hash(Password, 10, (hashErr, hashPassword) => {
        if (hashErr)
          return res.status(500).json({ error: "Password hashing failed" });

        // Step 3: Insert student directly using provided ClassID
        db.query(
          `INSERT INTO Std_Table (
            Std_Name, Std_Email, Std_B_Form, Std_DOB, Batch, Session, RollNo,
            GuardianContact, Password, Type, Status, ClassID, Religion, Gender, Address, GuardianName
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            Std_Name,
            Std_Email,
            Std_B_Form,
            Std_DOB,
            Batch,
            Session,
            RollNo,
            GuardianContact,
            hashPassword,
            Type,
            Status,
            ClassID,
            Religion,
            Gender,
            Address,
            GuardianName,
          ],
          (insertErr, result) => {
            if (insertErr) {
              return res
                .status(500)
                .json({ error: "Adding Student failed", errMsg: insertErr });
            }

            res.status(201).json({
              message: "Student added successfully",
              student: {
                Std_ID: result.insertId,
                Std_Name,
                Std_Email,
                RollNo,
                Status,
                ClassID,
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
  const { Std_Email, Password } = req.body;

  db.query(
    "SELECT * FROM Std_Table WHERE Std_Email = ?",
    [Std_Email],
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
          { userId: admin.AdminID, role: "student" },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res
          .status(200)
          .json({ message: "Login successful", student, token });
      });
    }
  );
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
};
