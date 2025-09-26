// src/models/index.js
import sequelize from "../database/db.js";
import Users from "./Users.js";
import Organizations from "./Organizations.js";
import Employee  from "../models/Employee.js";

// Associations
Users.hasMany(Organizations, { foreignKey: "userId", as: "organizations" });
Organizations.belongsTo(Users, { foreignKey: "userId", as: "creator" });

Organizations.hasMany(Employee, { foreignKey: "organizationId", as: "employees" });
Employee.belongsTo(Organizations, { foreignKey: "organizationId", as: "organization" });

const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    //await sequelize.sync({ alter: true }); // or { force: true } in dev only
    console.log("Models synchronized successfully.");
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
};

export { sequelize, initDB, Users, Organizations,  };
