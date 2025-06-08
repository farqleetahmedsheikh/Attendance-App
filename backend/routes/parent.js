/** @format */

const express = require("express");

const {
  handleAddParent,
  handleDeleteParent,
  handleGetAllParents,
  handleParentLogin,
  handleUpdateParent,
} = require("../controllers/parent");
const verifyAdmin = require("../middleware/auth"); // Import the auth middleware
const router = express.Router();

router.post("/add", verifyAdmin, handleAddParent);

router.post("/login", handleParentLogin);

router.get("/get-parents", handleGetAllParents);

router.put("/update/:id", verifyAdmin, handleUpdateParent);

router.delete("/delete/:id", verifyAdmin, handleDeleteParent);

module.exports = router;
