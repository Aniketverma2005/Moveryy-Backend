// src/models/index.js
import sequelize from "../database/db.js";
import Users from "./Users/Users.js";
import Organizations from "./Organizations.js";
import Employee  from "../models/Employee.js";
import Vehicles from "../models/Vehicles.js"
import VehiclesOffer from "../models/VehiclesOffer.js"

// Associations
Users.hasMany(Organizations, { foreignKey: "userId", as: "organizations" });
Organizations.belongsTo(Users, { foreignKey: "userId", as: "creator" });

Organizations.hasMany(Employee, { foreignKey: "organizationId", as: "employees" });
Employee.belongsTo(Organizations, { foreignKey: "organizationId", as: "organization" });

Organizations.hasMany(Vehicles, { foreignKey: "organizationId", as: "vehicles"});
Vehicles.belongsTo(Organizations, { foreignKey:"organizationId", as: "organization"});

Users.hasMany(Employee, { foreignKey: "createdBy", as: "createdEmployees" });
Users.hasMany(Employee, { foreignKey: "updatedBy", as: "updatedEmployees" });
Employee.belongsTo(Users, { foreignKey: "createdBy", as: "creator" });
Employee.belongsTo(Users, { foreignKey: "updatedBy", as: "updater" });

Users.hasMany(Vehicles, { foreignKey: "createdBy", as: "createdVehicles" });
Users.hasMany(Vehicles, { foreignKey: "updatedBy", as: "updatedVehicles" });
Vehicles.belongsTo(Users, { foreignKey: "createdBy", as: "creator" });
Vehicles.belongsTo(Users, { foreignKey: "updatedBy", as: "updater" });


Vehicles.hasOne(VehiclesOffer, {foreignKey: "vehicleId", as: "offer",});
VehiclesOffer.belongsTo(Vehicles, { foreignKey: "vehicleId", as: "vehicle",});


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

export { sequelize, initDB, Users, Organizations, Employee, Vehicles, VehiclesOffer};
