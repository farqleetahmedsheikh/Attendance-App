/** @format */

const express = require("express");
const router = express.Router();
const {
  submitQuery,
  getAllQueries,
  markAllAsRead,
  getUnreadCount,
  submitReply,
  getRepliesByQueryId,
} = require("../controllers/query");

// Route for submitting a new query (by parent)
router.post("/add", submitQuery);

// Route to fetch all queries (filtered in controller based on role)
router.get("/queries", getAllQueries);

// Route to mark all queries as read
router.put("/mark-read", markAllAsRead);

// Get unread count for logged-in user
router.get("/unread-count", getUnreadCount);

// 📩 Add a reply to a specific query
router.post("/reply", submitReply);

// 📜 Get full conversation thread (parent & teacher)
router.get("/thread/:queryId", getRepliesByQueryId);

module.exports = router;
