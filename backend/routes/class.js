/** @format */

const express = require("express");

const {
  handleAddClass,
  handleGetAllClasses,
  handleUpdateClass,
  handleDeleteClass,
} = require("../controllers/class");

const router = express.Router();

router.post("/add", handleAddClass);

router.get("/get-classes", handleGetAllClasses);

router.put("/update/:id", handleUpdateClass);

router.delete("/delete/:id", handleDeleteClass);

module.exports = router;
