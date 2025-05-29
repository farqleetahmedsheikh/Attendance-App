const express = require("express");

const {
  handleAddPTM,
  handleGetAllPTMs,
  handleDeletePTM,
} = require("../controllers/ptm");

const router = express.Router();

router.post("/add", handleAddPTM);

router.get("/get-ptm", handleGetAllPTMs);

router.delete("/:id", handleDeletePTM);

module.exports = router;
