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

})

export {registerVehicles, fetchVehicles}