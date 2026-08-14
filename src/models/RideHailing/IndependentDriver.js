import sequelize from "../../database/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const IndependentDriver = sequelize.define("independent_drivers", {
  driverId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,   // not needed for OTP login
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
    unique: true,
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'others'),
    allowNull: true,   // filled in later
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,   // filled in later
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
    unique: true,
  },
  licenseExpiry: {
    type: DataTypes.DATEONLY,
    allowNull: true,   // filled in later
  },
  licenseType: {
    type: DataTypes.ENUM('two_wheeler', 'four_wheeler', 'commercial'),
    allowNull: true,   // filled in later
  },
  aadharNumber: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
    unique: true,
  },
  panNumber: {
    type: DataTypes.STRING,
    allowNull: true,   // filled in later
    unique: true,
  },
  // OTP fields for email-based login
  emailOTP: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  emailOTPExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  bankAccountNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bankIfscCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bankAccountHolderName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profilePhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dlPhotoPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'suspended'),
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
  isOnline: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  currentLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
  },
  currentLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
  },
  lastLocationUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
  },
  totalRides: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

// Hash password before creating
IndependentDriver.beforeCreate(async (driver) => {
  if (driver.password) {
    driver.password = await bcrypt.hash(driver.password.trim(), 10);
  }
});

// Hash password before updating
IndependentDriver.beforeUpdate(async (driver) => {
  if (driver.changed("password")) {
    driver.password = await bcrypt.hash(driver.password.trim(), 10);
  }
});

export default IndependentDriver;
