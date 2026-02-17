import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Validation } from "../../utils/Validation.js";
import RideVehicle from "../../models/RideHailing/RideVehicle.js";
import IndependentDriver from "../../models/RideHailing/IndependentDriver.js";
import { Op } from "sequelize";

// Add Vehicle
export const addVehicle = asyncHandler(async (req, res) => {
  const {
    vehicleType,
    vehicleNumber,
    vehicleModel,
    vehicleBrand,
    vehicleColor,
    manufacturingYear,
    rcNumber,
    rcExpiryDate,
    insuranceNumber,
    insuranceProvider,
    insuranceExpiryDate,
    fitnessExpiryDate,
    permitNumber,
    permitExpiryDate,
    seatingCapacity,
    fuelType,
  } = req.body;

  // Get driver ID from authenticated request
  const driverId = req.driver.id;

  // ---------- VALIDATION ----------
  if (!['bike', 'auto', 'cab_mini', 'cab_sedan', 'cab_suv'].includes(vehicleType)) {
    throw new ApiErrors(400, "Invalid vehicle type");
  }

  if (Validation.isEmpty(vehicleNumber)) {
    throw new ApiErrors(400, "Vehicle number is required");
  }

  if (Validation.isEmpty(vehicleModel)) {
    throw new ApiErrors(400, "Vehicle model is required");
  }

  if (Validation.isEmpty(vehicleBrand)) {
    throw new ApiErrors(400, "Vehicle brand is required");
  }

  if (Validation.isEmpty(vehicleColor)) {
    throw new ApiErrors(400, "Vehicle color is required");
  }

  if (!manufacturingYear || manufacturingYear < 1990 || manufacturingYear > new Date().getFullYear()) {
    throw new ApiErrors(400, "Enter a valid manufacturing year");
  }

  if (Validation.isEmpty(rcNumber)) {
    throw new ApiErrors(400, "RC number is required");
  }

  if (Validation.isEmpty(insuranceNumber)) {
    throw new ApiErrors(400, "Insurance number is required");
  }

  if (!insuranceExpiryDate) {
    throw new ApiErrors(400, "Insurance expiry date is required");
  }

  // Check if insurance is expired
  if (new Date(insuranceExpiryDate) < new Date()) {
    throw new ApiErrors(400, "Insurance has expired. Please renew before registering.");
  }

  if (!seatingCapacity || seatingCapacity < 1) {
    throw new ApiErrors(400, "Enter valid seating capacity");
  }

  if (!['petrol', 'diesel', 'cng', 'electric'].includes(fuelType)) {
    throw new ApiErrors(400, "Invalid fuel type");
  }

  // ---------- CHECK IF DRIVER ALREADY HAS A VEHICLE ----------
  const existingVehicle = await RideVehicle.findOne({
    where: { driverId, isActive: true }
  });

  if (existingVehicle) {
    throw new ApiErrors(400, "You already have a registered vehicle. Please delete the existing one to add a new vehicle.");
  }

  // ---------- DUPLICATE CHECK ----------
  const duplicateVehicle = await RideVehicle.findOne({
    where: {
      [Op.or]: [
        { vehicleNumber },
        { rcNumber }
      ]
    }
  });

  if (duplicateVehicle) {
    throw new ApiErrors(400, "Vehicle with same vehicle number or RC number already exists");
  }

  // ---------- CREATE VEHICLE ----------
  const newVehicle = await RideVehicle.create({
    driverId,
    vehicleType,
    vehicleNumber: vehicleNumber.toUpperCase(),
    vehicleModel,
    vehicleBrand,
    vehicleColor,
    manufacturingYear,
    rcNumber: rcNumber.toUpperCase(),
    rcExpiryDate,
    insuranceNumber: insuranceNumber.toUpperCase(),
    insuranceProvider,
    insuranceExpiryDate,
    fitnessExpiryDate,
    permitNumber: permitNumber ? permitNumber.toUpperCase() : null,
    permitExpiryDate,
    seatingCapacity,
    fuelType,
    verificationStatus: 'pending',
    isVerified: false,
  });

  // ---------- RESPONSE ----------
  return res.status(201).json(
    new ApiResponse(201, "Vehicle registered successfully. Awaiting verification.", {
      vehicleId: newVehicle.vehicleId,
      driverId: newVehicle.driverId,
      vehicleType: newVehicle.vehicleType,
      vehicleNumber: newVehicle.vehicleNumber,
      vehicleModel: newVehicle.vehicleModel,
      verificationStatus: newVehicle.verificationStatus,
    })
  );
});

// Get Driver's Vehicle
export const getDriverVehicle = asyncHandler(async (req, res) => {
  const driverId = req.driver.id;

  const vehicle = await RideVehicle.findOne({
    where: { driverId, isActive: true },
    attributes: { exclude: ['createdAt', 'updatedAt'] }
  });

  if (!vehicle) {
    throw new ApiErrors(404, "No vehicle found. Please register your vehicle.");
  }

  return res.status(200).json(
    new ApiResponse(200, "Vehicle fetched successfully", vehicle)
  );
});

// Update Vehicle
export const updateVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const driverId = req.driver.id;

  const vehicle = await RideVehicle.findOne({
    where: { vehicleId, driverId, isActive: true }
  });

  if (!vehicle) {
    throw new ApiErrors(404, "Vehicle not found");
  }

  // Fields that can be updated
  const allowedUpdates = [
    'vehicleColor',
    'insuranceNumber',
    'insuranceProvider',
    'insuranceExpiryDate',
    'fitnessExpiryDate',
    'permitNumber',
    'permitExpiryDate',
    'rcExpiryDate',
  ];

  const updateData = {};
  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Validate insurance expiry if being updated
  if (updateData.insuranceExpiryDate && new Date(updateData.insuranceExpiryDate) < new Date()) {
    throw new ApiErrors(400, "Insurance expiry date cannot be in the past");
  }

  await vehicle.update(updateData);

  return res.status(200).json(
    new ApiResponse(200, "Vehicle updated successfully", vehicle)
  );
});

// Delete Vehicle (Soft Delete)
export const deleteVehicle = asyncHandler(async (req, res) => {
  const { vehicleId } = req.params;
  const driverId = req.driver.id;

  const vehicle = await RideVehicle.findOne({
    where: { vehicleId, driverId, isActive: true }
  });

  if (!vehicle) {
    throw new ApiErrors(404, "Vehicle not found");
  }

  // Soft delete
  vehicle.isActive = false;
  vehicle.isAvailable = false;
  await vehicle.save();

  return res.status(200).json(
    new ApiResponse(200, "Vehicle deleted successfully", {})
  );
});

// Check Vehicle Status
export const checkVehicleStatus = asyncHandler(async (req, res) => {
  const driverId = req.driver.id;

  const vehicle = await RideVehicle.findOne({
    where: { driverId, isActive: true }
  });

  const hasVehicle = !!vehicle;
  const canGoOnline = hasVehicle && 
                      vehicle.isVerified && 
                      vehicle.verificationStatus === 'approved' &&
                      new Date(vehicle.insuranceExpiryDate) > new Date();

  return res.status(200).json(
    new ApiResponse(200, "Vehicle status checked", {
      hasVehicle,
      canGoOnline,
      vehicleStatus: vehicle ? {
        verificationStatus: vehicle.verificationStatus,
        isVerified: vehicle.isVerified,
        insuranceExpired: new Date(vehicle.insuranceExpiryDate) < new Date(),
        insuranceExpiryDate: vehicle.insuranceExpiryDate,
      } : null
    })
  );
});
