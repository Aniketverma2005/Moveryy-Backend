import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import Vehicles from "../models/Vehicles.js";
import VehiclesOffer from "../models/VehiclesOffer.js"


const createVehicleOffer = asyncHandler(async (req, res) => {
  const {
    vehicleId,
    offerName,
    startDate,
    endDate,
    discountValue,
    discountType,
  } = req.body;

  if (!req.user) {
    throw new ApiErrors(401, "Unauthorized Token");
  }

  if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin users can create vehicle offers");
  }

  const organizationId = req.user.organizationId;

  if (!organizationId) {
    throw new ApiErrors(400, "Admin user does not belong to any organization");
  }

  // --------- Basic Validations ----------
  if (Validation.isEmpty(vehicleId)) {
    throw new ApiErrors(400, "Please select a vehicle to apply the offer");
  }

  if (Validation.isEmpty(offerName)) {
    throw new ApiErrors(400, "Offer Name is required");
  }

  if (Validation.isEmpty(startDate)) {
    throw new ApiErrors(400, "Start Date is mandatory");
  }

  if (Validation.isEmpty(endDate)) {
    throw new ApiErrors(400, "End Date is mandatory");
  }

  if (Validation.isEmpty(discountValue)) {
    throw new ApiErrors(400, "Discount Value is required");
  }

  const validTypes = ["percentage", "value"];
  if (
    Validation.isEmpty(discountType) ||
    !validTypes.includes(discountType.toLowerCase())
  ) {
    throw new ApiErrors(400, "Discount Type must be one of percentage or value");
  }

  // --------- Check Vehicle Ownership ----------
  const vehicle = await Vehicles.findOne({
    where: { vehicleId, organizationId },
  });

  if (!vehicle) {
    throw new ApiErrors(
      403,
      "This vehicle does not belong to your organization"
    );
  }

  // --------- Check if Offer Already Exists for Vehicle ----------
  const existingOffer = await VehiclesOffer.findOne({
    where: { offerName, vehicleId },
  });

  if (existingOffer) {
    throw new ApiErrors(
      409,
      "An offer with this name already exists for the selected vehicle"
    );
  }

  // --------- Create the Vehicle Offer ----------
  const newOffer = await VehiclesOffer.create({
    vehicleId,
    organizationId,
    offerName,
    startDate,
    endDate,
    discountValue,
    discountType,
    createdBy: req.user.id,
    updatedBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: "Vehicle Offer created successfully",
    data: newOffer,
  });
});

export { createVehicleOffer };