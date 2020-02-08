// const sqlite3 = require("sqlite3").verbose();
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/models/db/tasks.db"
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

const Tasks = sequelize.define("tasks", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.DataTypes.INTEGER
  },
  title: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.NUMBER
  }
});

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.findAll();
    resolve(data);
  });
};

const findOne = idTask => {
  return new Promise(async (resolve, reject) => {
    const foundedModel = await Tasks.findOne({ where: { id: idTask } });

    if (foundedModel === null) {
      console.log("FIND FAILED! Task not found");
      return resolve({ error: "FIND FAILED! Task not found" });
    }

    resolve(foundedModel);
  });
};

const createTask = task => {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.create(task);
    resolve(data);
  });
};

const removeTask = idTask => {
  return new Promise(async (resolve, reject) => {
    const foundedModel = await Tasks.findOne({ where: { id: idTask } });

    if (foundedModel === null) {
      console.log("DELETE FAILED! Task not found");
      return resolve({ error: "DELETE FAILED! Task not found" });
    }

    await foundedModel.destroy();
    return resolve({ id: foundedModel.id });
  });
};

module.exports = {
  findAll,
  findOne,
  createTask,
  removeTask
};
