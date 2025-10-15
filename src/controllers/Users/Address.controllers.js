import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { Validation } from "../../utils/Validation.js";
import Address from "../../models/Users/Address.js";

const addAddress = asyncHandler(async (req, res) => {
    const { addressType, addressName, address, city, state, pincode, isDefault } = req.body;

    if (!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if(req.user.role !== "user"){
        throw new ApiErrors(403, "Only users can add addresses");
    }

    if(Validation.isEmpty(addressType) || !["Home", "Office"].includes(addressType)){
        throw new ApiErrors(402, "Address Type must be either 'Home' or 'Office'");
    }

    if(Validation.isEmpty(addressName)){
        throw new ApiErrors(402, "Address Name is required");
    }

    if(Validation.isEmpty(address)){
        throw new ApiErrors(402, "Address is required");
    }

    if(Validation.isEmpty(city)){
        throw new ApiErrors(402, "City is required");
    }

    if(Validation.isEmpty(state)){
        throw new ApiErrors(402, "State is required");
    }

    if(Validation.isEmpty(pincode) || !Validation.validatePincode(pincode)){
        throw new ApiErrors(402, "Pincode is required");
    }

    const existingAddress = await Address.findOne({
        where: {
            addressName: addressName,
            city: city,
            state: state,
            pincode: pincode,
            createdBy: req.user.id,
            isActive: true
        }
    });

    if(existingAddress) {
        throw new ApiErrors(403, "Address with same details already exists");
    }

    const createAddress = await Address.create({
        addressType,
        addressName,
        address,
        city,
        state,
        pincode,
        isDefault: isDefault || false,
        createdBy: req.user.id,
        updatedBy: req.user.id
    })

    return res
    .status(200)
    .json({
        success: true,
        message: "Address added successfully",
        address: createAddress
    }); 
});


const getAddresses = asyncHandler(async (req, res) => {
    if(!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if(req.user.role !== "user"){
        throw new ApiErrors(403, "Only users can fetch addresses");
    }

    const addresses = await Address.findAll({
        where: {
            createdBy: req.user.id,
            isActive: true
        }
    })

    return res
    .status(200)
    .json({
        success: true,
        message: "Addresses fetched successfully",
        addresses
    });
});


const getAddressById = asyncHandler(async (req, res) => {
    const {addressId} = req.params;

    if(!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if(req.user.role != "user") throw new ApiErrors(403, "Only users can fetch addresses");

    if(Validation.isEmpty(addressId)){
        throw new ApiErrors(402, "Valid Address ID is required");
    }

    const address = await Address.findOne({
        where: {
            addressId: addressId,
            createdBy: req.user.id,
            isActive: true
        }
    });

    if(!address) throw new ApiErrors(404, "Address not found");

    return res
    .status(200)
    .json({
        success: true,
        message: "Address fetched successfully",
        address
    });
});


const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    if(!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if(req.user.role !== "user") {
        throw new ApiErrors(403, "Only users can update addresses");
    }

    if(Validation.isEmpty(addressId)) {
        throw new ApiErrors(402, "Valid Address ID is required");
    }

    const existingAddress = await Address.findOne({
        where: {
            addressId: addressId,
            createdBy: req.user.id,
            isActive: true
        }
    })

    if(!existingAddress) {
        throw new ApiErrors(404, "Address not found");
    }

    const allowedUpdate = [
        "addressType", "addressName", "address", "city", "state", "pincode"
    ]

    const updateData = {};
    allowedUpdate.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    updateData.updatedBy = req.user.id;

    await existingAddress.update(updateData);

    return res
    .status(200)
    .json({
        success: true,
        message: "Address updated successfully",
        address: existingAddress
    });

});


const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params;

    if(!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if(req.user.role !== "user") {
        throw new ApiErrors(403, "Only user can delete Addresses");
    }

    if(Validation.isEmpty(addressId)) {
        throw new ApiErrors(402, "Valid Address ID is required")
    }

    const existingAddress = await Address.findOne({
        where: {
            addressId: addressId,
            createdBy: req.user.id,
            isActive: true
        }
    })

    if(!existingAddress) {
        throw new ApiErrors(404, "Address not found");
    }

    await existingAddress.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Address deleted successfully",
    });
});

export { addAddress, getAddresses, getAddressById, updateAddress, deleteAddress };