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
        throw new ApiErrors(error)
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

export {createOffers}