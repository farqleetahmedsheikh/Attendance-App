const express = require("express");

const {
  handleTeacherLogin,
  handleAddTeacher,
  handleGetAllTeachers,
  handleDeleteTeacher,
} = require("../controllers/teachers");

const router = express.Router();

router.post("/add", handleAddTeacher);

router.post("/login", handleTeacherLogin);

router.get("/get-teachers", handleGetAllTeachers);

router.delete("/:id", handleDeleteTeacher);

module.exports = router;
