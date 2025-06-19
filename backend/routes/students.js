/** @format */

const express = require("express");

const {
  handleStudentLogin,
  handleAddStudent,
  handleDeleteStudent,
  handleGetAllStudents,
  handleUpdateStudent,
} = require("../controllers/students");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const upload = require("../middleware/multerConfig"); // Multer config
const router = express.Router();

router.post("/add", verifyAdmin, upload.single("Std_Image"), handleAddStudent);

router.post("/login", handleStudentLogin);

router.get("/get-students", handleGetAllStudents);

router.put("/update/:id", verifyAdmin, handleUpdateStudent);

router.delete("/delete/:id", verifyAdmin, handleDeleteStudent);

module.exports = router;
