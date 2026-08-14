import { Router } from "express";
import { 
  sendDriverOTP,
  verifyDriverOTP
} from "../../controllers/RideHailing/IndependentDriver.controllers.js";

const router = Router();

// OTP-based auth
router.post('/send-otp', sendDriverOTP);
router.post('/verify-otp', verifyDriverOTP);

export default router;
