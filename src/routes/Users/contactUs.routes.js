import { Router } from "express";
import { verifyToken } from "../../middlewares/Auth.middleware.js";
import { submitComplaint } from "../../controllers/Users/contactUs.controllers.js";

const router = Router();

router.post('/', verifyToken, submitComplaint);

export default router;
