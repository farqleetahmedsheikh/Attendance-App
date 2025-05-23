const express = require("express");

const {
  handleStudentLogin,
  handleAddStudent,
  handleDeleteStudent,
  handleGetAllStudents,
} = require("../controllers/students");

const router = express.Router();

router.post("/add", handleAddStudent);

router.post("/login", handleStudentLogin);

router.get("/get-students", handleGetAllStudents);

router.delete("/:id", handleDeleteStudent);

module.exports = router;
