const jwt = require("jsonwebtoken");

module.exports = (data, secretToken, expiresInMinutes) => {
  return jwt.sign(
    {
      ...data,
      exp: Math.floor(Date.now() / 1000) + 60 * expiresInMinutes
    },

    secretToken
  );
};
