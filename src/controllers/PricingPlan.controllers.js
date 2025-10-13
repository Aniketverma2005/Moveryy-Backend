import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import PricingPlan from "../models/PricingPlans.js";

const createPricingPlan = asyncHandler(async (req, res) => {
    const {
        serviceType,
        vehicleType,
        minCapacity,
        maxCapacity,
        capacityUnit,
        baseRate,
        pricePerKm,
        surgeCharges,
    } = req.body;

    if (!req.user) throw new ApiErrors(400, "Unauthorized Access");

    if (req.user.role !== "admin")
        throw new ApiErrors(400, "Only Admins can create pricing plans");

    const organizationId = req.user.organizationId;
    if (!organizationId)
        throw new ApiErrors(400, "User must be part of an Organization");

    if (Validation.isEmpty(serviceType))
        throw new ApiErrors(402, "Enter a valid Service Type");

    if (Validation.isEmpty(vehicleType))
        throw new ApiErrors(402, "Enter a valid Vehicle type");

    if (Validation.isEmpty(minCapacity) || isNaN(minCapacity) || minCapacity < 0)
        throw new ApiErrors(402, "Enter a valid Min Capacity");

    if (Validation.isEmpty(maxCapacity) || isNaN(maxCapacity) || maxCapacity <= minCapacity)
        throw new ApiErrors(402, "Max Capacity must be greater than Min Capacity");

    const validUnits = ["bhk", "tons", "cubic_meters"];
    const normalizedService = serviceType.toLowerCase();
    const normalizedUnit = capacityUnit?.toLowerCase();

    if (Validation.isEmpty(capacityUnit) || !validUnits.includes(normalizedUnit)) {
        throw new ApiErrors(
            401,
            "Capacity Unit must be one of [bhk, tons, cubic_meters]"
        );
    }

    // Conditional capacityUnit validation based on serviceType
    if (normalizedService === "vehicletransport" && normalizedUnit !== "tons") {
        throw new ApiErrors(
            401,
            "For 'vehicletransport' service, capacityUnit must be 'tons'"
        );
    }

    if (normalizedService === "houseshift" && normalizedUnit !== "bhk") {
        throw new ApiErrors(
            401,
            "For 'houseshift' service, capacityUnit must be 'bhk'"
        );
    }

    if (normalizedService === "officeshift" && normalizedUnit !== "cubic_meters") {
        throw new ApiErrors(
            401,
            "For 'officeshift' service, capacityUnit must be 'cubic_meters'"
        );
    }

    if (Validation.isEmpty(baseRate))
        throw new ApiErrors(402, "Enter a valid Base Rate");

    if (Validation.isEmpty(pricePerKm))
        throw new ApiErrors(402, "Enter a valid Price per Km");

    const existingPricingPlan = await PricingPlan.findOne({
        where: {
            organizationId,
            serviceType,
            vehicleType,
            minCapacity,
            maxCapacity,
            capacityUnit,
        },
    });

    if (existingPricingPlan)
        throw new ApiErrors(403, "Pricing Plan already exists for this configuration");

    const pricingPlan = await PricingPlan.create({
        organizationId,
        serviceType,
        vehicleType,
        minCapacity,
        maxCapacity,
        capacityUnit,
        baseRate,
        pricePerKm,
        surgeCharges,
        createdBy: req.user.id,
        updatedBy: req.user.id,
    });

    return res.status(201).json({
        success: true,
        message: "Pricing plan created successfully",
        data: pricingPlan,
    });
});


const getPricingPlans = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Only Admin can access this Data")
    }

    const organizationId = req.user.organizationId;
    if(!organizationId) {
        throw new ApiErrors(402, "Admin must be the part of the Organization")
    }

    try {
        const pricingPlan = await PricingPlan.findAll({
            where: {
                organizationId
            },
            attributes:[
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
            order: [["pricingPlanId", "ASC"]],
        });
    
        return res
        .status(200)
        .json({
            message: "Pricing Plans fetched Successfully",
            pricingPlan
        });
    } catch (error) {
        throw new ApiErrors(error)
    }
})


const deletePricingPlan = asyncHandler(async (req, res) => {
    const { pricingPlanId } = req.params;

    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Only Admin can Access this data")
    }

    const organizationId = req.user.organizationId;

    if(!organizationId) {
        throw new ApiErrors(402, "Admin must be the part of the Organization")
    }

    const pricingPlan = await PricingPlan.findOne({
        where: {
            pricingPlanId,
            organizationId: req.user.organizationId
        }
    })

    if(!pricingPlan) {
        throw new ApiErrors(403, "Pricing Plan not Found")
    }

    await pricingPlan.destroy();

    return res
    .status(200)
    .json({
        success: true,
        message: "Pricing Plan deleted successfully",
        data: pricingPlanId
    })
})

export { createPricingPlan, getPricingPlans, deletePricingPlan };
