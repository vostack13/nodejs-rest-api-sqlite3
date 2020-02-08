var express = require("express");
var router = express.Router();
const AppDB = require("../models/db");

router.get("/", async (req, res) => {
  const allTasks = await AppDB.find();
  return res.send(allTasks);
});

module.exports = router;
