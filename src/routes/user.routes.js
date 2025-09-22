import { Router } from "express";
import { registerUser } from "../controllers/users.controllers.js";
import { loginUser } from "../controllers/users.controllers.js";
import { logoutUser } from "../controllers/users.controllers.js";

const router = Router();

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(logoutUser)

export default router;