require('dotenv').config()
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);
const Message = require("./message")(sequelize, Sequelize.DataTypes);

sequelize.sync()

module.exports = {
  sequelize,
  Message,
};
