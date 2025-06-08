const express = require("express");

const {
  handleTeacherLogin,
  handleAddTeacher,
  handleGetAllTeachers,
  handleDeleteTeacher,
  handleUpdateTeacher,
} = require("../controllers/teachers");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const router = express.Router();

router.post("/add", verifyAdmin,handleAddTeacher);

router.post("/login", handleTeacherLogin);

router.get("/get-teachers", verifyAdmin,handleGetAllTeachers);

router.put("/update/:id", verifyAdmin,handleUpdateTeacher);

router.delete("/delete/:id", verifyAdmin,handleDeleteTeacher);

module.exports = router;
