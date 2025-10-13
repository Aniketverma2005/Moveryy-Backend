import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";


const pricingPlan = sequelize.define("pricingplan", {
    pricingPlanId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizations',
            key: 'organizationId'
        },
        onDelete: "CASCADE",
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicleType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    minCapacity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    maxCapacity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    capacityUnit: {
        type: DataTypes.ENUM("BHK", "Tons", "cubic_meters"),
        allowNull: false
    },

    baseRate: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    pricePerKm: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    surgeCharges: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    }
}, {timestamps: true, freezeTableName: true});

export default pricingPlan;