const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// const env = process.env.NODE_ENV || "development";

const sequelize = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_ID,
  process.env.DB_PASSWORD,
  {
    database: process.env.DB_SCHEMA,
    username: process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: (...logs) => console.log(logs[0]),
  },
);

const Users = require("./users");
const PointLogs = require("./pointLogs");

const db = {
  User: Users,
  PointLog: PointLogs,
};

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
