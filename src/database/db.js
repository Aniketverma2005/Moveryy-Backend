// src/database/db.js
import { config } from "dotenv";
import { Sequelize } from "sequelize";

config(); // load env vars

const sequelize = new Sequelize(
  process.env.DB_NAME || "moveryy_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "Sarvesh@2006",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;
