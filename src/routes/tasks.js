const express = require("express");
const router = express.Router();
const AppDB = require("../models/db");
const authenticateToken = require("../models/helpers/authenticateToken");

router.get("/", authenticateToken, async (req, res) => {
  const allTasks = await AppDB.findAll();
  return res.send(allTasks);
});

module.exports = router;
