require("dotenv").config();
var express = require("express");
var cors = require("cors");
var app = express();
var tasksRouter = require("./routes/tasks");
var taskRouter = require("./routes/task");
var signinRouter = require("./routes/signin");
var refreshRouter = require("./routes/refresh_token");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", function(req, res) {
  res.send("Welcome to the Rest API Tasks Server!");
});

app.use("/tasks", tasksRouter);
app.use("/task", taskRouter);
app.use("/signin", signinRouter);
app.use("/refresh", refreshRouter);

app.use((req, res, next) => {
  res.status(404).json({ err: "404", message: "Not found" });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ err: "500", message: err.message });
});

app.listen(8080, function() {
  console.log("Example app listening on port 8080!");
});
