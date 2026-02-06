import { Router } from "express";
import { createBooking, checkoutPreview, getOrganizationBookings } from "../../controllers/Bookings/Bookings.controllers.js";
import { verifyToken } from "../../middlewares/Auth.middleware.js";

const router = Router();

router.route('/create').post(verifyToken, createBooking);
router.route('/checkout-preview').post(verifyToken, checkoutPreview);
router.route('/organization-bookings').get(verifyToken, getOrganizationBookings);



export default router;