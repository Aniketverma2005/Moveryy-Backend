import { Router } from "express";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";
import { createOffers, deleteOffers, getOffers, updateOffers } from "../controllers/Offers.controllers.js";


const router = Router();


router.route('/create').post(verifyNewGeneratedToken, createOffers)

router.route('/all').get(verifyNewGeneratedToken, getOffers)

router.route('/:offerId').delete(verifyNewGeneratedToken, deleteOffers)

router.route('/:offerId').patch(verifyNewGeneratedToken, updateOffers)

export default router;