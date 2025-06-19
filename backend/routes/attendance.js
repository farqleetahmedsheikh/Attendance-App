const express = require("express");
const router = express.Router();
const {
  handleMarkAttendance,
  handleGetAttendance,
} = require("../controllers/attendance");

router.post("/mark", handleMarkAttendance);
router.post("/get", handleGetAttendance);

module.exports = router;
