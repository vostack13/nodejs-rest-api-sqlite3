const express = require("express");
const router = express.Router();
const AppDB = require("../models/db");
const authenticateToken = require("../models/helpers/authenticateToken");

router.get("/:id", async (req, res) => {
  const result = await AppDB.findOne(req.params.id);
  return res.send(result);
});

router.post("/", authenticateToken, async (req, res) => {
  await AppDB.createTask(req.body);
  const result = await AppDB.findAll();

  return res.status(result.status).send(result.data);
});

router.post("/like", authenticateToken, async (req, res) => {
  const result = await AppDB.setIsLike(req.body);

  return res.status(result.status).send();
});

router.delete("/:id", async (req, res) => {
  const result = await AppDB.removeTask(req.params.id);
  return res.send(result);
});

module.exports = router;
