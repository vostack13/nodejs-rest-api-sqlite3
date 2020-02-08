var express = require("express");
var router = express.Router();
var TaskList = require("../models/tasks");
const AppDB = require("../models/db");

const tasksList = new TaskList();

router.get("/", async (req, res) => {
  const r = await AppDB.find();
  return res.send(r);
});

router.post("/addItem", async (req, res) => {
  // console.log(req.body);
  // tasksList.addTask(req.body);
  await AppDB.createTask(req.body);
  const r = await AppDB.find();
  return res.send(r);
});

module.exports = router;
