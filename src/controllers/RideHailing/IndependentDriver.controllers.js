import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Validation } from "../../utils/Validation.js";
import IndependentDriver from "../../models/RideHailing/IndependentDriver.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

// Register Independent Driver
export const registerDriver = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    pincode,
    licenseNumber,
    licenseExpiry,
    licenseType,
    aadharNumber,
    panNumber,
  } = req.body;

  // ---------- VALIDATION ----------
  if (Validation.isEmpty(fullName)) {
    throw new ApiErrors(400, "Full name is required");
  }

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "Enter a valid email");
  }

  if (Validation.isEmpty(password) || password.length < 8) {
    throw new ApiErrors(400, "Password must be at least 8 characters");
  }

  if (Validation.isEmpty(phone) || !Validation.validatePhone(phone)) {
    throw new ApiErrors(400, "Enter a valid phone number");
  }

  if (!["male", "female", "others"].includes(gender)) {
    throw new ApiErrors(400, "Gender must be male, female, or others");
  }

  if (Validation.isEmpty(address)) {
    throw new ApiErrors(400, "Address is required");
  }

  if (Validation.isEmpty(city)) {
    throw new ApiErrors(400, "City is required");
  }

  if (Validation.isEmpty(licenseNumber)) {
    throw new ApiErrors(400, "License number is required");
  }

  if (!licenseExpiry) {
    throw new ApiErrors(400, "License expiry date is required");
  }

  if (!["two_wheeler", "four_wheeler", "commercial"].includes(licenseType)) {
    throw new ApiErrors(400, "Invalid license type");
  }

  if (Validation.isEmpty(aadharNumber) || aadharNumber.length !== 12) {
    throw new ApiErrors(400, "Enter a valid 12-digit Aadhar number");
  }

  if (Validation.isEmpty(panNumber) || panNumber.length !== 10) {
    throw new ApiErrors(400, "Enter a valid 10-character PAN number");
  }

  // ---------- DUPLICATE CHECK ----------
  const existingDriver = await IndependentDriver.findOne({
    where: {
      [Op.or]: [
        { email: email.toLowerCase() },
        { phone },
        { licenseNumber },
        { aadharNumber },
        { panNumber }
      ]
    }
  });

  if (existingDriver) {
    throw new ApiErrors(400, "Driver with same email, phone, license, Aadhar, or PAN already exists");
  }

  // ---------- CREATE DRIVER ----------
  const newDriver = await IndependentDriver.create({
    fullName,
    email: email.toLowerCase(),
    password: password.trim(),
    phone,
    dateOfBirth,
    gender,
    address,
    city,
    state,
    pincode,
    licenseNumber,
    licenseExpiry,
    licenseType,
    aadharNumber,
    panNumber,
    status: 'pending',
  });

  // ---------- RESPONSE ----------
  return res.status(201).json(
    new ApiResponse(201, "Driver registered successfully. Awaiting admin approval.", {
      driverId: newDriver.driverId,
      fullName: newDriver.fullName,
      email: newDriver.email,
      phone: newDriver.phone,
      status: newDriver.status,
    })
  );
});

// Login Independent Driver
export const loginDriver = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || Validation.isEmpty(email)) {
    throw new ApiErrors(401, "Email is required");
  }

  if (!password || Validation.isEmpty(password)) {
    throw new ApiErrors(401, "Password is required");
  }

  // Find driver
  const driver = await IndependentDriver.findOne({
    where: { email: email.toLowerCase(), isActive: true },
  });

  if (!driver) {
    throw new ApiErrors(401, "Driver not found");
  }

  // Verify password
  const isMatch = await bcrypt.compare(password.trim(), driver.password);

  if (!isMatch) {
    throw new ApiErrors(401, "Incorrect password");
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { driverId: driver.driverId, email: driver.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { driverId: driver.driverId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Update driver
  driver.refreshToken = refreshToken;
  await driver.save();

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("driverAccessToken", accessToken, cookieOptions)
    .cookie("driverRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "Driver logged in successfully", {
        driver: {
          driverId: driver.driverId,
          fullName: driver.fullName,
          email: driver.email,
          phone: driver.phone,
          rating: driver.rating,
          totalRides: driver.totalRides,
          status: driver.status,
        },
        accessToken,
        refreshToken,
      })
    );
});


// Get all drivers (Admin only)
export const getAllDrivers = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can access this data");
  }

  const { status } = req.query; // Filter by status: pending, approved, rejected, suspended

  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }

  const drivers = await IndependentDriver.findAll({
    where: whereClause,
    attributes: { exclude: ["password", "refreshToken"] },
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json(
    new ApiResponse(200, "Drivers fetched successfully", {
      total: drivers.length,
      drivers,
    })
  );
});

// Get driver by ID (Admin only)
export const getDriverById = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can access this data");
  }

  const { driverId } = req.params;

  const driver = await IndependentDriver.findByPk(driverId, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!driver) {
    throw new ApiErrors(404, "Driver not found");
  }

  return res.status(200).json(
    new ApiResponse(200, "Driver fetched successfully", { driver })
  );
});

// Approve driver (Admin only)
export const approveDriver = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can approve drivers");
  }

  const { driverId } = req.params;

  const driver = await IndependentDriver.findByPk(driverId);

  if (!driver) {
    throw new ApiErrors(404, "Driver not found");
  }

  if (driver.status === "approved") {
    throw new ApiErrors(400, "Driver is already approved");
  }

  driver.status = "approved";
  driver.rejectionReason = null;
  await driver.save();

  return res.status(200).json(
    new ApiResponse(200, "Driver approved successfully", {
      driverId: driver.driverId,
      fullName: driver.fullName,
      email: driver.email,
      status: driver.status,
    })
  );
});

// Reject driver (Admin only)
export const rejectDriver = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can reject drivers");
  }

  const { driverId } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason || Validation.isEmpty(rejectionReason)) {
    throw new ApiErrors(400, "Rejection reason is required");
  }

  const driver = await IndependentDriver.findByPk(driverId);

  if (!driver) {
    throw new ApiErrors(404, "Driver not found");
  }

  driver.status = "rejected";
  driver.rejectionReason = rejectionReason;
  await driver.save();

  return res.status(200).json(
    new ApiResponse(200, "Driver rejected successfully", {
      driverId: driver.driverId,
      fullName: driver.fullName,
      email: driver.email,
      status: driver.status,
      rejectionReason: driver.rejectionReason,
    })
  );
});

// Suspend driver (Admin only)
export const suspendDriver = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can suspend drivers");
  }

  const { driverId } = req.params;
  const { reason } = req.body;

  const driver = await IndependentDriver.findByPk(driverId);

  if (!driver) {
    throw new ApiErrors(404, "Driver not found");
  }

  driver.status = "suspended";
  driver.rejectionReason = reason || "Suspended by admin";
  driver.isOnline = false;
  driver.isAvailable = false;
  await driver.save();

  return res.status(200).json(
    new ApiResponse(200, "Driver suspended successfully", {
      driverId: driver.driverId,
      fullName: driver.fullName,
      status: driver.status,
    })
  );
});
