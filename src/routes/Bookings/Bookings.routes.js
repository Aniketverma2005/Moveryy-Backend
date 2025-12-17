import { Router } from "express";
import { createBooking, checkoutPreview } from "../../controllers/Bookings/Bookings.controllers.js";
import { verifyToken } from "../../middlewares/Auth.middleware.js";

const router = Router();

router.route('/create').post(verifyToken, createBooking);
router.route('/checkout-preview').post(verifyToken, checkoutPreview);

export default router;