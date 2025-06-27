const express = require("express");
const router = express.Router();
const {
  submitQuery,
  getAllQueries,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/query");

router.post("/add", submitQuery);
router.get("/queries", getAllQueries); // Admin list
router.put("/mark-read", markAllAsRead); // Mark all read
router.get("/unread-count", getUnreadCount); // For badge

module.exports = router;
