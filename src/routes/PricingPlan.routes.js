import { Router } from "express";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";
import { createPricingPlan, deletePricingPlan, getPricingPlans } from "../controllers/PricingPlan.controllers.js";

const router = Router();

router.route('/create').post(verifyNewGeneratedToken, createPricingPlan)

router.route('/all').get(verifyNewGeneratedToken, getPricingPlans)

router.route('/:pricingPlanId').delete(verifyNewGeneratedToken, deletePricingPlan)

export default router;