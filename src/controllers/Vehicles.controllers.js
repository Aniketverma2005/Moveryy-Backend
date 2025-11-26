import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Validation } from "../utils/Validation.js";
import { Op } from "sequelize";
import { Vehicles, VehiclesOffer } from "../models/index.js";
import PricingPlans from "../models/PricingPlans.js";




const registerVehicles = asyncHandler(async (req, res) => {

    const{
        vehicleName,
        registrationNumber,
        manufacturer,
        vehicleType,
        capacityValue,
        capacityUnit,
        serviceType,
        registrarName,
        chassisNumber,
    } = req.body;


    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can register vehicles");
    }

    const organizationId = req.user.organizationId;


    if(Validation.isEmpty(vehicleName)) {
        throw new ApiErrors(401, "Vehicle Name is required")
    }

    if(Validation.isEmpty(registrationNumber)) {
        throw new ApiErrors(401, "Enter a Valid Registration Number")
    }

    if(Validation.isEmpty(manufacturer)) {
        throw new ApiErrors(401, "Manufacturer is required")
    }

    const validType = ["truck", "6-wheeler", "8-wheeler"];
    if(Validation.isEmpty(vehicleType) || !validType.includes(vehicleType.toLowerCase())) {
        throw new ApiErrors(401, "Enter the type of vehicle i.e. [truck, 6-wheeler, 8-wheeler, etc]")
    }

    if(Validation.isEmpty(capacityValue)) {
        throw new ApiErrors(401, "Capacity of the Vehicle is required")
    }

    const validUnit = ["bhk", "tons", "cubic_meters"]
    if(Validation.isEmpty(capacityUnit) || !validUnit.includes(capacityUnit.toLowerCase())){
        throw new ApiErrors(401, "Capacity must be one of these i.e.[BHK, Tons, cubic_meters]")
    }

    const validService = ["houseshift", "vehicletransport", "officeshift"];
    if(Validation.isEmpty(serviceType) || !validService.includes(serviceType.toLowerCase())) {
        throw new ApiErrors(401, "service Types must one of [houseshift, vehicleshift, officeshift]")
    }

    if(Validation.isEmpty(registrarName)) {
        throw new ApiErrors(401, "Enter the registrar of the vehicle")
    }

    if(Validation.isEmpty(chassisNumber)) {
        throw new ApiErrors(401, "Enter the Chassis Number of the vehicle")
    }

    try {
        const existingVehicle = await Vehicles.findOne({where: { registrationNumber }}) 
        if(existingVehicle) {
            throw new ApiErrors(401, "Vehicle with this registration number already Exists")
        }
    } catch (error) {
        console.log("Sequelize Error", error)
        throw new ApiErrors(error)
    }


    try {
        const existingVehicle = await Vehicles.findOne({where: { chassisNumber }}) 
        if(existingVehicle) {
            throw new ApiErrors(401, "Vehicle with this chassis number already Exists")
        }
    } catch (error) {
        console.log("Sequelize Error", error)
        throw new ApiErrors(error)
    }

    const newVehicle = await Vehicles.create({
        organizationId,
        vehicleName,
        vehicleType,
        registrationNumber,
        manufacturer,
        capacityValue,
        capacityUnit,
        serviceType,
        registrarName,
        chassisNumber,
        hasOffer: false,
        createdBy: req.user.id,
        updatedBy: req.user.id
    })

    return res
    .status(200)
    .json({
        success:true,
        message:"Vehicle registered Successfully",
        data:{
            vehicleId: newVehicle.vehicleId,
            organizationId: newVehicle.organizationId,
            createdBy: newVehicle.createdBy,
            vehicleName: newVehicle.vehicleName,
            registrationNumber: newVehicle.registrationNumber,
            chassisNumber: newVehicle.chassisNumber,
        }
    })
});



const fetchVehicles = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiErrors(401, "Unauthorized Access");
  if (req.user.role !== "admin") throw new ApiErrors(403, "Only Admin can Access this data");

  const organizationId = req.user.organizationId;

  try {
    // Fetch all vehicles for the organization
    const vehicles = await Vehicles.findAll({
      where: { organizationId },
      attributes: [
        "vehicleId",
        "vehicleName",
        "registrationNumber",
        "manufacturer",
        "vehicleType",
        "capacityValue",
        "capacityUnit",
        "registrarName",
        "chassisNumber",
        "serviceType",
        "status",
        "isActive",
        "hasOffer", // directly return the boolean field
        "createdBy",
        "createdAt",
      ],
      order: [["vehicleId", "ASC"]],
    });

    return res.status(200).json({
      message: "Vehicles fetched Successfully",
      vehicles,
    });
  } catch (error) {
    throw new ApiErrors(error);
  }
});


const updateVehicleData = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can update this");
    }

    const vehicle = await Vehicles.findByPk(req.params.id);

    if (!vehicle) {
        throw new ApiErrors(404, "Vehicle not found");
    }

    
    if (vehicle.organizationId !== req.user.organizationId) {
        throw new ApiErrors(403, "You cannot update vehicles outside your organization");
    }

    
    const allowedUpdates = [
        "vehicleName", "vehicleType", "registrationNumber", 
        "manufacturer", "capacityValue", "capacityUnit", 
        "serviceType", "registrarName", "chassisNumber"
    ];
    const updateData = {};
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // Add updatedBy
    updateData.updatedBy = req.user.id;

    await vehicle.update(updateData);

    return res.status(200).json({
        message: "Details Updated Successfully",
        data: vehicle
    });
});


const deleteVehicle = asyncHandler(async (req, res) => {
    const {vehicleId} = req.params

    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Only Admin can Delete this data")
    }

    const vehicle = await Vehicles.findOne({
        where:{
            vehicleId,
            organizationId: req.user.organizationId
        }
    });

    if(!vehicle) {
        throw new ApiErrors(400, "Vehicle not found")
    }

    await vehicle.destroy();

    return res.status(200).json({
        success: true,
        message: "Vehicle deleted successfully",
        data: { vehicleId }
    });
})


const countVehicle = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(401, "Only admin can access this data")
    }

    const organizationId = req.user.organizationId;

    if(!organizationId) {
        throw new ApiErrors(403, "user must be the part of Organization")
    }

    const vehicleCount = await Vehicles.count({
        organization: organizationId
    })

    return res
    .status(200)
    .json({
        message: "Total vehicle fetched Successfully",
        data: {
            organizationId,
            totalVehicle: vehicleCount
        }
    });
});



const getVehiclesWithPricing = asyncHandler(async (req, res) => {
    const { organizationId, serviceType, capacityValue, capacityUnit, distance } = req.query;

    // Check user auth and role
    if (!req.user) throw new ApiErrors(401, "Unauthorized Access");
    if (req.user.role !== "user") throw new ApiErrors(403, "Only users can access this data");

    //Validate required fields
    if (Validation.isEmpty(organizationId))
        throw new ApiErrors(400, "Organization ID is required");

    if (Validation.isEmpty(serviceType))
        throw new ApiErrors(400, "Service Type is required");

    if (Validation.isEmpty(capacityValue) || isNaN(capacityValue))
        throw new ApiErrors(400, "Enter a valid capacity value");

    const validUnits = ["bhk", "tons", "cubic_meters"];
    if (Validation.isEmpty(capacityUnit) || !validUnits.includes(capacityUnit.toLowerCase()))
        throw new ApiErrors(400, "Capacity Unit must be one of [bhk, tons, cubic_meters]");

    if (Validation.isEmpty(distance) || isNaN(distance))
        throw new ApiErrors(400, "Enter a valid distance");

    const normalizedService = serviceType.toLowerCase();
    const normalizedUnit = capacityUnit.toLowerCase();
    const numericCapacity = parseFloat(capacityValue);

    //Fetch pricing plan purely by service type and capacity range
    const pricingPlan = await PricingPlans.findOne({
        where: {
            organizationId,
            serviceType: normalizedService,
            capacityUnit: normalizedUnit,
            minCapacity: { [Op.lte]: numericCapacity },
            maxCapacity: { [Op.gte]: numericCapacity },
        },
        attributes: [
            "pricingPlanId",
            "organizationId",
            "serviceType",
            "vehicleType",
            "minCapacity",
            "maxCapacity",
            "capacityUnit",
            "baseRate",
            "pricePerKm",
            "surgeCharges"
        ],
    });

    if (!pricingPlan)
        throw new ApiErrors(404, "No pricing plan found for this service and capacity");

    // Fetch vehicles in that organization with same service + capacity unit
    const vehicles = await Vehicles.findAll({
        where: {
            organizationId,
            serviceType: normalizedService,
            capacityUnit: normalizedUnit,
            isActive: true
        },
        attributes: [
            "vehicleId",
            "vehicleName",
            "vehicleType",
            "registrationNumber",
            "manufacturer",
            "capacityValue",
            "capacityUnit",
            "serviceType",
            "status",
            "isActive"
        ],
        order: [["vehicleId", "ASC"]],
    });

    if (!vehicles.length)
        throw new ApiErrors(404, "No vehicles found for this organization and service");

    // Attach the same pricing plan to all matching vehicles
    const mergedResults = vehicles.map(vehicle => {
    const v = vehicle.toJSON();

    const totalPrice =
        Number(pricingPlan.baseRate) +
        (Number(distance) * Number(pricingPlan.pricePerKm)) +
        Number(pricingPlan.surgeCharges || 0);

    return {
        ...v,
        pricingPlan,
        totalPrice: Number(totalPrice.toFixed(2))  // 2 decimal precision
    };
});


    // Return response
    return res.status(200).json({
        success: true,
        message: "Vehicles with pricing fetched successfully",
        data: mergedResults
    });
});



const getVehiclesOffers = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    // Authentication check
    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Access");
    }

    // Only normal user can access
    if (req.user.role !== "user") {
        throw new ApiErrors(403, "Only users can access this data");
    }

    // Check if vehicle exists
    const vehicle = await Vehicles.findOne({
        where: { vehicleId }
    });

    if (!vehicle) {
        throw new ApiErrors(404, "Vehicle not found");
    }

    // Fetch all offers of this vehicle
    const offers = await VehiclesOffer.findAll({
        where: {
            vehicleId: vehicleId,
            isActive: true   // remove this line if you want ALL offers
        },
        order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
        success: true,
        message: "Vehicle offers fetched successfully",
        data: offers,
    });
});








export {
    registerVehicles,
    fetchVehicles, 
    updateVehicleData, 
    deleteVehicle, 
    countVehicle, 
    getVehiclesWithPricing,
    getVehiclesOffers
}