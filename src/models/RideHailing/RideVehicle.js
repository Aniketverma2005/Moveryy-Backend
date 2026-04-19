import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";

const RideVehicle = sequelize.define("RideVehicles", {
  vehicleId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'independent_drivers',
      key: 'driverId'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  vehicleType: {
    type: DataTypes.ENUM('bike', 'auto', 'cab_mini', 'cab_sedan', 'cab_suv'),
    allowNull: false,
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  vehicleModel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleBrand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vehicleColor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  manufacturingYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  // RC Details
  rcNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  rcExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  rcPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Insurance Details
  insuranceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  insuranceProvider: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insuranceExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  insurancePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Fitness & Permit (for commercial vehicles)
  fitnessExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  fitnessPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  permitNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  permitExpiryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  permitPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Vehicle Specifications
  seatingCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  fuelType: {
    type: DataTypes.ENUM('petrol', 'diesel', 'cng', 'electric'),
    allowNull: false,
  },
  
  // Vehicle Photos
  vehiclePhotoFront: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehiclePhotoBack: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vehiclePhotoSide: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Status & Verification
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
});

export default RideVehicle;
