import { DataTypes } from "sequelize";
import sequelize from "../../database/db.js";

const Bookings = sequelize.define("bookings", {
    bookingId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    organizationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "organizations",
            key: "organizationId"
        },
        onDelete: "CASCADE",
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "users",
            key: "id",
        },
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "employees",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "vehicles",
            key: "vehicleId",
        },
    },
    pricingPlanId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "pricingplan",
            key: "pricingPlanId",
        },
    },
    offerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "offers",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    vehicleOfferId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "vehiclesOffer",
            key: "id",
        },
        onDelete: "SET NULL",
    },
    serviceType: {
        type: DataTypes.ENUM("houseshift", "officeshift", "vehicleshift"),
        allowNull: false,
    },

    startLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endLocation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    distance: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    duration: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    tripDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    baseRate: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    distanceCost: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    fuelSurcharge: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    totalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    discount: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0,
    },
    finalPrice: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    bookingStatus: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false,
        defaultValue: "pending",
    },
}, {
    tableName: "bookings",
    timestamps: true, 
    freezeTableName: true
});

export default Bookings;
