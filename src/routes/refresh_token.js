var express = require("express");
var router = express.Router();
const AppDB = require("../models/db");

router.post("/", async (req, res) => {
  const result = await AppDB.updateToken(req.body).catch(error => {
    console.log("ERROR REFRESH:", error);
  });

  return res.status(result.status).send(result.data);
});

module.exports = router;
