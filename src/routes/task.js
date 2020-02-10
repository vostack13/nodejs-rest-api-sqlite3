const express = require("express");
const router = express.Router();
const AppDB = require("../models/db");

router.get("/:id", async (req, res) => {
  const result = await AppDB.findOne(req.params.id);
  return res.send(result);
});

router.post("/", async (req, res) => {
  await AppDB.createTask(req.body);
  const allTasks = await AppDB.findAll();
  return res.send(allTasks);
});

router.delete("/:id", async (req, res) => {
  const result = await AppDB.removeTask(req.params.id);
  return res.send(result);
});

module.exports = router;
