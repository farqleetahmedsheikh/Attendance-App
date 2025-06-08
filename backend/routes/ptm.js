/** @format */

const express = require("express");

const {
  handleAddPTM,
  handleGetAllPTMs,
  handleDeletePTM,
  handleUpdatePTM,
} = require("../controllers/ptm");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const router = express.Router();

router.post("/add", verifyAdmin, handleAddPTM);

router.get("/get-ptm", handleGetAllPTMs);

router.put("/update/:id", verifyAdmin, handleUpdatePTM);

router.delete("/delete/:id", verifyAdmin, handleDeletePTM);

module.exports = router;
