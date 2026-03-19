require("dotenv").config();

const dialect = process.env.DB_DIALECT || "mysql";
const port = Number(process.env.DB_PORT) || (dialect === "postgres" ? 5432 : 3306);
const dialectOptions = {};

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port,
    dialect,
    dialectOptions,
    logging: false,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port,
    dialect,
    dialectOptions,
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port,
    dialect,
    dialectOptions,
    logging: false,
  },
};
