const express = require("express");
const router = express.Router();
const AppDB = require("../models/db");
const authenticateToken = require("../models/helpers/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
  const result = await AppDB.findAll();
  return res.status(result.status).send(result.data);
});

module.exports = router;
