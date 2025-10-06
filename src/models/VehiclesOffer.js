import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";


const vehiclesOffer = sequelize.define("vehiclesOffers", {
    vehicleOfferId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,   
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "vehicles",
            key: "vehicleId"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'organizations',
            key: 'organizationId'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    offerName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    discountValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discountType: {
        type: DataTypes.ENUM("percentage", "value"),
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
}, 
{timestamps: true, freezeTableName: true});

export default vehiclesOffer;
