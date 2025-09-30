import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const vehicles = sequelize.define("vehicles", {
    vehicleId:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizations',
            key: 'organizationId'
        },
    },
    vehicleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    registrationNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacityValue: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    capacityUnit: {
        type: DataTypes.ENUM("BHK", "Tons", "cubic_meters"),
        allowNull: false,
    },
    registrarName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    chassisNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serviceType: {
        type: DataTypes.ENUM("houseshift", "officeshift", "vehicleshift"),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "available",  
        validate: {
            isIn: [["available", "on-duty"]] 
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }

}, {timestamps: true})

export default vehicles;