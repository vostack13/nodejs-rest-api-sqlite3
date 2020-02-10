require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const tasksRouter = require("./routes/tasks");
const taskRouter = require("./routes/task");
const signInRouter = require("./routes/signin");
const refreshRouter = require("./routes/refresh_token");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function(req, res) {
  res.send("Welcome to the Rest API Tasks Server!");
});

app.use("/tasks", tasksRouter);
app.use("/task", taskRouter);
app.use("/sign-in", signInRouter);
app.use("/refresh", refreshRouter);

app.use((req, res) => {
  res.status(404).json({ err: "404", message: "Not found" });
});

app.use((err, req, res) => {
  console.log(err.stack);
  res.status(500).json({ err: "500", message: err.message });
});

app.listen(8032, function() {
  console.log("Example app listening on port 8032!");
});
