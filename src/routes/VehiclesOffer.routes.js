import { Router } from "express";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";
import { createVehicleOffer, deleteOffers, fetchAllOffers, fetchVehiclesWithOffers } from "../controllers/VehiclesOffer.controllers.js";

const router = Router();

router.route('/create').post(verifyNewGeneratedToken, createVehicleOffer)

router.route('/vehicles').get(verifyNewGeneratedToken, fetchVehiclesWithOffers)

router.route('/all').get(verifyNewGeneratedToken, fetchAllOffers)

router.route('/:vehicleOfferId').delete(verifyNewGeneratedToken, deleteOffers)

export default router;