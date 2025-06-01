/** @format */

const express = require("express");

const {
  addSubject,
  getAllSubjects,
  deleteSubject,
  handleUpdateSubject,
} = require("../controllers/subject");

const router = express.Router();

router.post("/add", addSubject);

router.get("/get-subjects", getAllSubjects);

router.put("/update/:id", handleUpdateSubject);

router.delete("/delete/:id", deleteSubject);

module.exports = router;
