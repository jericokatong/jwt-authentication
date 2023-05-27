const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const db = new Sequelize("db_jwt3", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = db;
