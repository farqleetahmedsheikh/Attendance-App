const bcrypt = require("bcrypt");
const db = require("../connection");

// ✅ Signup Teacher
const handleAddTeacher = (req, res) => {
  const {
    TeacherName,
    TeacherEmail,
    Password,
    TeacherDOB,
    TeacherPhoneNo,
    TeacherType,
    TeacherCNIC,
    Religion,
    Gender,
    Address,
    SubjectID, // now an array of numeric IDs: [1, 2, 5]
  } = req.body;

  if (
    !TeacherName ||
    !TeacherEmail ||
    !Password ||
    !TeacherDOB ||
    !TeacherPhoneNo ||
    !TeacherType ||
    !TeacherCNIC ||
    !Religion ||
    !Gender ||
    !Address ||
    !Array.isArray(SubjectID) ||
    SubjectID.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "All fields including Subject IDs are required" });
  }

  // Check for duplicates
  db.query(
    "SELECT * FROM TeacherTable WHERE TeacherEmail = ? OR TeacherCNIC = ?",
    [TeacherEmail, TeacherCNIC],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length > 0) {
        return res.status(400).json({
          error: "Teacher already registered with this email or CNIC",
        });
      }

      // Hash the password
      bcrypt.hash(Password, 10, (hashErr, hashedPassword) => {
        if (hashErr)
          return res.status(500).json({ error: "Password hashing failed" });

        const insertTeacherQuery = `
          INSERT INTO TeacherTable (
            TeacherName, TeacherEmail, Password, TeacherDOB,
            TeacherPhoneNo, TeacherType, TeacherCNIC, Religion, Gender, Address
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const teacherValues = [
          TeacherName,
          TeacherEmail,
          hashedPassword,
          TeacherDOB,
          TeacherPhoneNo,
          TeacherType,
          TeacherCNIC,
          Religion,
          Gender,
          Address,
        ];

        db.query(insertTeacherQuery, teacherValues, (insertErr, result) => {
          if (insertErr)
            return res
              .status(500)
              .json({ error: "Adding Teacher failed", errMsg: insertErr });

          const TeacherID = result.insertId;

          // Build values for TeacherSubjectTable
          const subjectAssignments = SubjectID.map((id) => [TeacherID, id]);

          db.query(
            "INSERT INTO TeacherSubjectTable (TeacherID, SubjectID) VALUES ?",
            [subjectAssignments],
            (linkErr) => {
              if (linkErr) {
                return res.status(500).json({
                  error: "Failed to link subjects to teacher",
                  errMsg: linkErr,
                });
              }

              res.status(201).json({
                message: "Teacher added successfully",
                teacher: {
                  TeacherID,
                  TeacherName,
                  TeacherEmail,
                  SubjectIDs: SubjectID,
                  TeacherPhoneNo,
                },
              });
            }
          );
        });
      });
    }
  );
};

// ✅ Login Teacher
const handleTeacherLogin = (req, res) => {
  const { Std_Email, Password } = req.body;

  db.query(
    "SELECT * FROM Std_Table WHERE Std_Email = ?",
    [Std_Email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const teacher = results[0];

      bcrypt.compare(Password, teacher.Password, (bcryptErr, match) => {
        if (bcryptErr)
          return res.status(500).json({ error: "Password comparison failed" });

        if (!match)
          return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign(
          { userId: admin.AdminID, role: "teacher" },
          SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
        return res
          .status(200)
          .json({ message: "Login successful", teacher, token });
      });
    }
  );
};

// ✅ Show all Teachers
const handleGetAllTeachers = (req, res) => {
  db.query("SELECT * FROM TeacherTable", (err, results) => {
    db.query("SELECT * FROM TeacherSubjectTable", (err, subjectResults) => {
      if (err) {
        return res.status(500).json({ error: "Failed to fetch subjects" });
      }

      // Map subject IDs to names
      const subjectMap = {};
      subjectResults.forEach((subj) => {
        if (!subjectMap[subj.TeacherID]) {
          subjectMap[subj.TeacherID] = [];
        }
        subjectMap[subj.TeacherID].push(subj.SubjectID);
      });

      // Attach subjects to each teacher
      const teachersWithSubjects = results.map((teacher) => ({
        ...teacher,
        SubjectIDs: subjectMap[teacher.TeacherID] || [],
      }));

      res.status(200).json(teachersWithSubjects);
    });
  });
};

// ❌ Delete teacher by ID
const handleDeleteTeacher = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM TeacherTable WHERE TeacherID = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to delete teacher" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Teacher not found" });
      }

      res.status(200).json({ message: "Teacher deleted successfully" });
    }
  );
};

module.exports = {
  handleTeacherLogin,
  handleAddTeacher,
  handleDeleteTeacher,
  handleGetAllTeachers,
};
