const express = require("express");

const {
  handleTeacherLogin,
  handleAddTeacher,
  handleGetAllTeachers,
  handleDeleteTeacher,
  handleUpdateTeacher,
} = require("../controllers/teachers");

const router = express.Router();

router.post("/add", handleAddTeacher);

router.post("/login", handleTeacherLogin);

router.get("/get-teachers", handleGetAllTeachers);

router.put("/update/:id", handleUpdateTeacher);

router.delete("/delete/:id", handleDeleteTeacher);

module.exports = router;
