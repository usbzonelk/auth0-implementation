const dotenv = require("dotenv").config();
const Sequelize = require("sequelize");

const dbConnection = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
});

module.exports = { dbConnection };
