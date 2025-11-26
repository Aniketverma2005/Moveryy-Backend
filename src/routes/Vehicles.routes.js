import { Router } from "express";
import { registerVehicles, fetchVehicles, updateVehicleData, deleteVehicle, countVehicle, getVehiclesWithPricing, getVehiclesOffers } from "../controllers/Vehicles.controllers.js";
import { verifyNewGeneratedToken, verifyToken } from "../middlewares/Auth.middleware.js";


const router = Router();

router.route('/register').post(verifyNewGeneratedToken, registerVehicles);

router.route('/all').get(verifyNewGeneratedToken, fetchVehicles)

router.route('/:id').patch(verifyNewGeneratedToken, updateVehicleData)

router.route('/:vehicleId').delete(verifyNewGeneratedToken, deleteVehicle)

router.route('').get(verifyNewGeneratedToken, countVehicle)

router.route('/available').get(verifyToken, getVehiclesWithPricing);

router.route('/:vehicleId/offers').get(verifyToken, getVehiclesOffers);

export default router;