const express = require("express");

const {
  handleAddParent,
  handleDeleteParent,
  handleGetAllParents,
  handleParentLogin,
} = require("../controllers/parent");

const router = express.Router();

router.post("/add", handleAddParent);

router.post("/login", handleParentLogin);

router.get("/get-parents", handleGetAllParents);

router.delete("/:id", handleDeleteParent);

module.exports = router;
