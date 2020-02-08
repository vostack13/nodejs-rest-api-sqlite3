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

function find() {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.findAll();
    console.log("data", JSON.stringify(data));
    resolve(JSON.stringify(data));
  });
}

function createTask(task) {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.create(task);
    resolve(data);
  });
}

module.exports = {
  find,
  createTask
};

// class AppDB {
//   constructor() {
//     this.db = new sqlite3.Database("./src/models/db/tasks.db", err => {
//       if (err) {
//         console.error(err.message);
//       }
//       console.log("Connected to the tasks database.");
//     });
//   }

//   selectAllTasks() {
//     return new Promise((resolve, reject) => {
//       let result = [];

//       this.db.all(`SELECT * FROM tasks`, (err, rows) => {
//         if (err) {
//           console.error(err.message);
//           reject(err.message);
//         }

//         result = rows;
//       });
//     });
//   }
// }

// console.log("t", selectAllTasks());

// close the database connection
// db.close(err => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Close the database connection.");
// });

// module.exports = AppDB;

const insertTask = `INSERT INTO "tasks"(
  "id",
  "title",
  "description",
  "createdBy"
) VALUES (
  1,
  'Изучить Angular 8',
  'Посмотреть лекции, почитать умные книжки',
  '0'
)`;
