import { DataTypes } from "sequelize";
import sequelize from "../../database/db.js";

const BookingCrew = sequelize.define("bookingCrew", {
  bookingCrewId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "bookings",
      key: "bookingId"
    },
    onDelete: "CASCADE"
  },

  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "employees",
      key: "employeeId"
    },
    onDelete: "SET NULL"
  },

  role: {
    type: DataTypes.ENUM("driver", "crew"),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM("assigned", "in-progress", "completed"),
    defaultValue: "assigned"
  }
}, {
  timestamps: true,
  freezeTableName: true
});

export default BookingCrew;
