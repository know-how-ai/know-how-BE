require("dotenv").config();

module.exports = {
  development: {
    database: process.env.DB_SCHEMA,
    username: process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
    logging: (...logs) => console.log(logs[0]),
  },
  test: {
    database: process.env.DB_SCHEMA + "_test",
    username: process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
  },
  production: {
    database: process.env.DB_SCHEMA,
    username: process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    dialect: "mysql",
    host: process.env.DB_HOST,
    logging: false,
  },
};
