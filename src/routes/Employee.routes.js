import { Router } from "express";
import { createEmployee } from "../controllers/Employee.controllers.js";
import { verifyNewGeneratedToken } from "../middlewares/Auth.middleware.js";

const router = Router();

router.route('/create').post(verifyNewGeneratedToken, createEmployee)

export default router