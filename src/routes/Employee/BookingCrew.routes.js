import { Router } from "express";
import { getBookingCrew } from "../../controllers/Employee/BookingCrew.controllers.js";
import { verifyNewGeneratedToken } from "../../middlewares/Auth.middleware.js";

const router = Router();

router.route('/:bookingId').get(verifyNewGeneratedToken, getBookingCrew);

export default router;