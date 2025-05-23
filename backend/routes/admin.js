const express = require('express');
const router = express.Router();

const {
  handleAdminSignup,
  handleAdminLogin,
  handleGetAdmins,
  handleDeleteAdmin,
} = require("../controllers/admin");

router.post("/signup", handleAdminSignup);

router.post("/login", handleAdminLogin);

router.get("/get-admins", handleGetAdmins);

router.delete("/:id", handleDeleteAdmin);

module.exports = router;