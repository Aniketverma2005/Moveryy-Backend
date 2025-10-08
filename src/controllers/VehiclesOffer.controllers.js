import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import { Vehicles, VehiclesOffer } from "../models/index.js";
import { Op } from "sequelize";



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
  where: {
    offerName,
    vehicleId,
    endDate: {
      [Op.gte]: new Date() // Only consider offers that have not ended
    },
    isActive: true
  },
});

if (existingOffer) {
  throw new ApiErrors(
    409,
    `This vehicle already has an active offer (${existingOffer.offerName}) until ${existingOffer.endDate.toISOString().split('T')[0]}`
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

  await Vehicles.update(
    { hasOffer: true },
    { where: { vehicleId } }
  );

  res.status(201).json({
    success: true,
    message: "Vehicle Offer created successfully",
    data: newOffer,
  });
});


const fetchVehiclesWithOffers = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiErrors(401, "Unauthorized Token");

  const organizationId = req.user.organizationId;
  if (!organizationId) throw new ApiErrors(400, "User does not belong to any organization");

  const vehicles = await Vehicles.findAll({
    where: { organizationId },
    include: [
      {
        model: VehiclesOffer,
        as: "offer",
        attributes: [
          "vehicleOfferId",
          "offerName",
          "startDate",
          "endDate",
          "discountValue",
          "discountType",
          "isActive",
        ],
        where: {
          isActive: true,                 
          endDate: { [Op.gte]: new Date() } 
        },
        required: true
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  

  res.status(200).json({
    success: true,
    message: "Vehicles with their active offers fetched successfully",
    data: vehicles,
  });
});


const fetchAllOffers = asyncHandler(async (req, res) => {
  if(!req.user){
    throw new ApiErrors(400, "Unauthorized Access")
  }

  const organizationId = req.user.organizationId;
  if(!organizationId) {
    throw new ApiErrors(402, "Admin must be the part of the Organization")
  }

  try {
    const offers = await VehiclesOffer.findAll({
      where: {organizationId},
      attributes: [
        "vehicleOfferId",
        "vehicleId",
        "offerName",
        "startDate",
        "endDate",
        "discountValue",
        "discountType",
        
      ],
      include: [
      {
        model: Vehicles,
        as: "vehicle",
        attributes: ["vehicleName", "registrationNumber"],
      },
    ],

      order: [["vehicleOfferId", "ASC"]]
    });

    return res.status(200).json({
      message: "Offers fetched Successfully",
      offers,
    });
  } catch (error) {
    throw new ApiErrors(error);
  }
});


const deleteOffers = asyncHandler(async (req, res) => {
  const { vehicleOfferId } = req.params;

  if (!req.user) {
    throw new ApiErrors(401, "Unauthorized Access");
  }

  const organizationId = req.user.organizationId;
  if (!organizationId) throw new ApiErrors(400, "User does not belong to any organization");

  // Find the offer to delete
  const offer = await VehiclesOffer.findOne({
    where: { vehicleOfferId, organizationId },
  });

  if (!offer) {
    throw new ApiErrors(404, "Offer not found");
  }

  // Delete the offer
  await offer.destroy();

  // Update the vehicle's hasOffer field to false
  await Vehicles.update(
    { hasOffer: false },
    { where: { vehicleId: offer.vehicleId } }
  );

  return res.status(200).json({
    success: true,
    message: "Vehicle offer deleted successfully",
  });
});

export { createVehicleOffer, fetchVehiclesWithOffers, deleteOffers, fetchAllOffers };