import { Sequelize } from "sequelize";

const dialect = process.env.DB_DIALECT || "mysql";
const port = parseInt(process.env.DB_PORT) || (dialect === "postgres" ? 5432 : 3306);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port,
  dialect,
  logging: false,
});

export default sequelize;
