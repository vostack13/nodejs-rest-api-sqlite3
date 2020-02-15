const generateToken = require("./helpers/generateToken");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");

const ACCESS_EXP_MINUTES = 20;
const REFRESH_EXP_MINUTES = 60 * 24 * 14;

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
    },
    is_like: {
        type: Sequelize.BOOLEAN,
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
            return resolve({ status: 403, data: { error: "User not found !!!" } });
        }

        const sessionItem = {
            userId: findUserModel.userId,

            accessToken: generateToken(
                { login: findUserModel.login },
                process.env.ACCESS_TOKEN_SECRET,
                ACCESS_EXP_MINUTES,
            ),

            refreshToken: generateToken(
                { login: findUserModel.login },
                process.env.REFRESH_TOKEN_SECRET,
                REFRESH_EXP_MINUTES,
            ),

            accessExpiresIn: Math.floor(Date.now() / 1000) + 60 * ACCESS_EXP_MINUTES,
            expiresIn: Math.floor(Date.now() / 1000) + 60 * REFRESH_EXP_MINUTES,
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
                accessToken_exp: sessionItem.accessExpiresIn,
                refreshToken: sessionItem.refreshToken,
                refreshToken_exp: sessionItem.expiresIn,
                login: findUserModel.login
            }
        });
    });
};

const updateToken = ({ refreshToken }) => {
    return new Promise(async (resolve, reject) => {
        if (!refreshToken)
            return resolve({ status: 401, data: { error: "Invalid token" } });

        const session = await Sessions.findOne({ where: { refreshToken } });

        if (!session) console.log("Sessions not found ");

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err)
                return resolve({ status: 401, data: { error: "Invalid token" } });

            const userModel = await Users.findOne({where: {userId: session.userId}});

            if (!userModel) {
                return resolve({ status: 403, data: { error: "User not found" } });
            }

            const accessToken = generateToken(
                { login: userModel.login },
                process.env.ACCESS_TOKEN_SECRET,
                ACCESS_EXP_MINUTES,
            );

            const refreshToken = generateToken(
                { login: userModel.login },
                process.env.REFRESH_TOKEN_SECRET,
                REFRESH_EXP_MINUTES,
            );

            const accessExpiresIn = Math.floor(Date.now() / 1000) + 60 * ACCESS_EXP_MINUTES;
            const expiresIn = Math.floor(Date.now() / 1000) + 60 * REFRESH_EXP_MINUTES;

            const updatedSession = await session.update({refreshToken, expiresIn});

            if (!updatedSession) {
                return resolve({ status: 401, data: {error: "Error authorization" }});
            }

            resolve({
                status: 200,

                data: {
                    accessToken: accessToken,
                    accessToken_exp: accessExpiresIn,
                    refreshToken: refreshToken,
                    refreshToken_exp: expiresIn,
                }
            });
        });
    });
};

const findAll = () => {
  return new Promise(async (resolve, reject) => {
    const data = await Tasks.findAll();
    // return resolve({ error: "Task not found" });

    // resolve(data);
    resolve({status: 200, data});
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
    resolve({status: 200, data});
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

const setIsLike = ({idTask, statusLike}) => {
    return new Promise(async (resolve, reject) => {
        const foundedModel = await Tasks.findOne({ where: { id: idTask } });

        if (foundedModel === null) {
            console.log("UPDATE LIKE FAILED! Task not found");
            return resolve({status: 404, error: "Task not found" });
        }

        const updatedTask = await foundedModel.update({is_like: !foundedModel.is_like});

        if (!updatedTask) {
            return resolve({status: 500, error: "Error update like" });
        }

        return resolve({status: 200});
    });
};

module.exports = {
    signIn,
    updateToken,
    findAll,
    findOne,
    createTask,
    removeTask,
    setIsLike,
};
