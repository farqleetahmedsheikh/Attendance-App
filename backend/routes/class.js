const express = require("express");

const {
  handleAddClass,
  handleGetAllClasses,
  handleDeleteClass,
} = require("../controllers/class");

const router = express.Router();

router.post("/add", handleAddClass);

router.get("/get-classes", handleGetAllClasses);

router.delete("/:id", handleDeleteClass);

module.exports = router;
