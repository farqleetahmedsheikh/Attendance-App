/** @format */

const express = require("express");

const {
  addSubject,
  getAllSubjects,
  deleteSubject,
  handleUpdateSubject,
} = require("../controllers/subject");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const router = express.Router();

router.post("/add", verifyAdmin, addSubject);

router.get("/get-subjects", getAllSubjects);

router.put("/update/:id", verifyAdmin, handleUpdateSubject);

router.delete("/delete/:id", verifyAdmin, deleteSubject);

module.exports = router;
