import { DataTypes } from "sequelize";
import sequelize from "../../database/db.js";


const address = sequelize.define("addresses", {
    addressId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    addressType: {
        type: DataTypes.ENUM("Home", "Office")
    },
    addressName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
    }
}, {timestamps: true, freezeTableName: true})


export default address;