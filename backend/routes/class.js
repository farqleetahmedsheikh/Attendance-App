/** @format */

const express = require("express");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const {
  handleAddClass,
  handleGetAllClasses,
  handleUpdateClass,
  handleDeleteClass,
} = require("../controllers/class");

const router = express.Router();

router.post("/add", verifyAdmin, handleAddClass);

router.get("/get-classes", handleGetAllClasses);

router.put("/update/:id", verifyAdmin, handleUpdateClass);

router.delete("/delete/:id", verifyAdmin, handleDeleteClass);

module.exports = router;
