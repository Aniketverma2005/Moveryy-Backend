import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt"

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
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: "vehicles",
        key: "vehicleId"
        },
        onDelete: "SET NULL"
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "busy",  
        validate: {
            isIn: [["available", "busy"]] 
        }
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
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



employee.beforeUpdate(async (employee) => {
  if (employee.changed("password")) {
    employee.password = await bcrypt.hash(employee.password.trim(), 10);
  }
});

export default employee;