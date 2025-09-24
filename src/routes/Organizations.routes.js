import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { createOrganization } from "../controllers/Organization.controllers.js";

const router = Router();

//Check if the user is authenticated before accessing any routes
router.use(verifyToken);

router.route('/create').post(createOrganization)

export default router;