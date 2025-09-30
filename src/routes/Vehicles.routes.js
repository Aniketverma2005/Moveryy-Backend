import { Router } from "express";
import { registerVehicles, fetchVehicles } from "../controllers/Vehicles.controllers.js";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";


const router = Router();

router.route('/register').post(verifyNewGeneratedToken, registerVehicles);

router.route('/all').get(verifyNewGeneratedToken, fetchVehicles)

export default router;