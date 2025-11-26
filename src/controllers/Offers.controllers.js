import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import Offers from "../models/Offers.js";


const createOffers = asyncHandler(async (req, res) => {
    const {
        offerName,
        startDate,
        endDate,
        discountValue,
        discountType,
    } = req.body;


    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can create organizations");
    }

    const organizationId = req.user.organizationId;

    if (!organizationId) {
        throw new ApiErrors(400, "Admin user does not belong to any organization");
    }

    if(Validation.isEmpty(offerName)) {
        throw new ApiErrors(400, "Offer Name is required")
    }

    if(Validation.isEmpty(startDate)) {
        throw new ApiErrors(400, "Start Date is mandatory")
    }

    if(Validation.isEmpty(endDate)) {
        throw new ApiErrors(400, "End Date id mandatory")
    }

    if(Validation.isEmpty(discountValue)) {
        throw new ApiErrors(400, "Discount Value is Required")
    }

    const validType = ["percentage", "value"]
    if(Validation.isEmpty(discountType) || !validType.includes(discountType.toLowerCase())) {
        throw new ApiErrors(400, "Discount Type must be one of percentage, value")
    }

    try {
        const existingOffer = await Offers.findOne({where: {offerName}})
    
        if(existingOffer) {
            throw new ApiErrors(409, "Offer Already Exists")
        }
    } catch (error) {
        throw new ApiErrors(500, error.message || "Internal Server Error")
    }

    const newOffers = await Offers.create({
        organizationId,
        offerName,
        startDate,
        endDate,
        discountValue:parseFloat(discountValue),
        discountType,
        createdBy: req.user.id,
        updatedBy: req.user.id
    })

    return res
    .status(200)
    .json({
        message:"Offer created Successfully",
        data: {
            offerId: newOffers.offerId,
            organizationId: newOffers.organizationId,
            offerName: newOffers.offerName,
            startDate: newOffers.startDate,
            endDate: newOffers.endDate,
            discountValue: newOffers.discountValue,
            discountType: newOffers.discountType
        }
    });
});


const getOffers = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Admin can only Access this data")
    }

    const organization = req.user.organizationId;

    if(!organization) {
        throw new ApiErrors(400, "Admin must be the part of this Organization")
    }

    try {
        const offers = await Offers.findAll({
            where: {organizationId: organization},
            order: [["offerId", "ASC"]]
        })
    
        return res
        .status(200)
        .json({
            message:"Offers fetched Successfully",
            offers: offers
        })
    } catch (error) {
        throw new ApiErrors(500, error.message || "Internal Server Error")
    }
})


const deleteOffers = asyncHandler(async (req, res) => {
    const{ offerId } = req.params;

    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Admin can only Access this data")
    }

    const organization = req.user.organizationId;

    if(!organization) {
        throw new ApiErrors(400, "Admin must be the part of this Organization")
    }

    const offers = await Offers.findOne({
        where: {
            offerId, 
            organizationId: organization
        },
    })

    if(!offers) {
        throw new ApiErrors(400, "Offer not Found")
    }

    await offers.destroy();

    return res
    .status(200)
    .json({
        message: "Offers deleted Successfully"
    })
})


const updateOffers = asyncHandler(async (req, res) => {
    const { offerId } = req.params;

    if (!req.user) {
        throw new ApiErrors(400, "Unauthorized Access");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(400, "Only admin can access this data");
    }

    const organization = req.user.organizationId;

    if (!organization) {
        throw new ApiErrors(400, "Admin must be part of this Organization");
    }

    //Find offer by ID and organization
    const offers = await Offers.findOne({
        where: {
            offerId,
            organizationId: organization,
        },
    });

    if (!offers) {
        throw new ApiErrors(400, "Offer not found");
    }

    const allowedUpdates = [
        "offerName",
        "startDate",
        "endDate",
        "discountValue",
        "discountType",
    ];

    const updateData = {};
    allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    updateData.updatedBy = req.user.id;

    await offers.update(updateData);

    return res.status(200).json({
        message: "Offer updated successfully",
        data: offers,
    });
});




export {
    createOffers,
    getOffers,
    deleteOffers,
    updateOffers
}