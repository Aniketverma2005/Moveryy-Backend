import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Validation } from "../utils/Validation.js";
import Vehicles from "../models/Vehicles.js"



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

    if(Validation.isEmpty(vehicleType)) {
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

    const organizationId = req.user.organizationId;

    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(401, "Only Admin can Access this data")
    }

    try {
        const vehicles = await Vehicles.findAll({
            where: {organizationId},
            order: [["vehicleId", "ASC"]]
        })
    
        return res
        .status(200)
        .json({
            message:"Vehicles fetched Successfully",
            vehicles: vehicles
        })
    } catch (error) {
        throw new ApiErrors(error)
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

    // Ensure same organization
    if (vehicle.organizationId !== req.user.organizationId) {
        throw new ApiErrors(403, "You cannot update vehicles outside your organization");
    }

    // Pick only allowed fields
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



export {registerVehicles, fetchVehicles, updateVehicleData, deleteVehicle, countVehicle}