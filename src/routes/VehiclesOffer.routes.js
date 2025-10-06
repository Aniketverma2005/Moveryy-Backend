import { Router } from "express";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";
import { createVehicleOffer } from "../controllers/VehiclesOffer.controllers.js";

const router = Router();

router.route('/create').post(verifyNewGeneratedToken, createVehicleOffer)

export default router;