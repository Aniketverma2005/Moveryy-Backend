import sequelize from "../database/db.js";
import { DataTypes } from "sequelize";

const employee = sequelize.define("employees", {
    employeeId: {
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
    employeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    aadharNumber:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    panNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    blacklistReason:{
        type: DataTypes.STRING,
        allowNull: true,
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

}, {timestamps: true});

export default employee;