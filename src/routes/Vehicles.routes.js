import { Router } from "express";
import { registerVehicles, fetchVehicles, updateVehicleData, deleteVehicle } from "../controllers/Vehicles.controllers.js";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";


const router = Router();

router.route('/register').post(verifyNewGeneratedToken, registerVehicles);

router.route('/all').get(verifyNewGeneratedToken, fetchVehicles)

router.route('/:id').patch(verifyNewGeneratedToken, updateVehicleData)

router.route('/:vehicleId').delete(verifyNewGeneratedToken, deleteVehicle)

export default router;