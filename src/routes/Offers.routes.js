import { Router } from "express";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";
import { createOffers } from "../controllers/Offers.controllers.js";


const router = Router();


router.route('/create').post(verifyNewGeneratedToken, createOffers)

export default router;