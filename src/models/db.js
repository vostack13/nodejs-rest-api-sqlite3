const generateToken = require("./helpers/generateToken");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");

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
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Users = sequelize.define("users", {
  userId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.DataTypes.INTEGER
  },

  login: {
    type: Sequelize.STRING,
    allowNull: false
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Sessions = sequelize.define("sessions", {
  userId: {
    allowNull: false,
    type: Sequelize.DataTypes.INTEGER
  },

  refreshToken: {
    type: Sequelize.STRING,
    allowNull: false
  },

  expiresIn: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false
  }
});

const signIn = formData => {
  return new Promise(async (resolve, reject) => {
    const findUserModel = await Users.findOne({
      where: { login: formData.login, password: formData.password }
    });

    if (findUserModel === null) {
      console.log("FIND FAILED! User not found ");
      return resolve({ status: 403, data: { error: "User not found" } });
    }

    const accessExpMinutes = 1;
    const refreshExpMinutes = 10;

    const sessionItem = {
      userId: findUserModel.userId,

      accessToken: generateToken(
        { login: findUserModel.login },
        process.env.ACCESS_TOKEN_SECRET,
        accessExpMinutes
      ),

      refreshToken: generateToken(
        { login: findUserModel.login },
        process.env.REFRESH_TOKEN_SECRET,
        refreshExpMinutes
      ),

      expiresIn: Math.floor(Date.now() / 1000) + 60 * refreshExpMinutes
    };

    const createdSession = await Sessions.create({
      userId: sessionItem.userId,
      refreshToken: sessionItem.refreshToken,
      expiresIn: sessionItem.expiresIn
    });

    if (createdSession === undefined) {
      console.log("CREATE SESSION FAILED! Session not created ");
      return resolve({ status: 401, data: { error: "Error sign in" } });
    }

    resolve({
      status: 200,
      data: {
        accessToken: sessionItem.accessToken,
        refreshToken: sessionItem.refreshToken,
        login: findUserModel.login
      }
    });
  });
};

const updateToken = ({ refreshToken }) => {
  return new Promise(async (resolve, reject) => {
    if (!refreshToken)
      resolve({ status: 401, data: { error: "Invalid token" } });

    const sessionList = await Sessions.findAll({ where: { refreshToken } });

    if (!sessionList) console.log("Sessions not found ");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return resolve({ status: 401, data: { error: "Invalid token" } });

      resolve({ status: 200, data: {} });
    });
  });
};

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.findAll();
    // return resolve({ error: "Task not found" });

    // resolve(data);
    resolve(data);
  });
};

const findOne = idTask => {
  return new Promise(async (resolve, reject) => {
    const foundedModel = await Tasks.findOne({ where: { id: idTask } });

    if (foundedModel === null) {
      console.log("FIND FAILED! Task not found");
      return resolve({ error: "Task not found" });
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
      return resolve({ error: "Task not found" });
    }

    await foundedModel.destroy();
    return resolve({ id: foundedModel.id });
  });
};

module.exports = {
  signIn,
  updateToken,
  findAll,
  findOne,
  createTask,
  removeTask
};
