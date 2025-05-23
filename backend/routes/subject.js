const express = require("express");

const {
  addSubject,
  getAllSubjects,
  deleteSubject,
} = require("../controllers/subject");

const router = express.Router();

router.post("/add", addSubject);

router.get("/get-subjects", getAllSubjects);

router.delete("/:name", deleteSubject);

module.exports = router;
