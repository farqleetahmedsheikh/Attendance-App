const express = require("express");

const {
  handleAddPTM,
  handleGetAllPTMs,
  handleDeletePTM,
  handleUpdatePTM,
} = require("../controllers/ptm");

const router = express.Router();

router.post("/add", handleAddPTM);

router.get("/get-ptm", handleGetAllPTMs);

router.put("/update/:id", handleUpdatePTM);

router.delete("/delete/:id", handleDeletePTM);

module.exports = router;
