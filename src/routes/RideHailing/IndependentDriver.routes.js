import { Router } from "express";
import { 
  registerDriver, 
  loginDriver 
} from "../../controllers/RideHailing/IndependentDriver.controllers.js";

const router = Router();

// Public routes
router.route('/register').post(registerDriver);
router.route('/login').post(loginDriver);

export default router;
