import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, refreshAccessToken, registerUser, updateUserFirstName, updateUserLastName, verifyEmailOTP, resendEmailOTP, sendLoginOTP, verifyLoginOTP } from "../../controllers/Users/users.controllers.js";
import { loginUser } from "../../controllers/Users/users.controllers.js";
import { logoutUser } from "../../controllers/Users/users.controllers.js";
import { verifyToken } from "../../middlewares/Auth.middleware.js";

const router = Router();

router.route('/signup').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyToken, logoutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.route('/user').get(verifyToken, getCurrentUser)

router.route('/updatepassword').patch(verifyToken, changeCurrentPassword)

router.route('/updatefirstname').patch(verifyToken, updateUserFirstName)

router.route('/updatelastname').patch(verifyToken, updateUserLastName)

router.post("/verify-otp", verifyEmailOTP);

router.post("/resend-otp", resendEmailOTP);


router.post('/login/send-otp', sendLoginOTP);

router.post('/login/verify-otp', verifyLoginOTP);

export default router;

