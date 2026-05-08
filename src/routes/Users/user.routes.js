import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserFirstName,
    updateUserLastName,
    verifyEmailOTP,
    resendEmailOTP,
    sendLoginOTP,
    verifyLoginOTP
} from "../../controllers/Users/users.controllers.js";
import { verifyToken } from "../../middlewares/Auth.middleware.js";
import { googleSignup } from '../../controllers/GoogleAuth/GoogleAuth.controllers.js';

const router = Router();

router.post('/signup', registerUser);
router.post('/google/signup', googleSignup);

router.post('/login', loginUser);
router.post('/login/send-otp', sendLoginOTP);
router.post('/login/verify-otp', verifyLoginOTP);

router.post('/logout', verifyToken, logoutUser);
router.post('/refresh-token', refreshAccessToken);

router.get('/user', verifyToken, getCurrentUser);
router.patch('/updatepassword', verifyToken, changeCurrentPassword);
router.patch('/updatefirstname', verifyToken, updateUserFirstName);
router.patch('/updatelastname', verifyToken, updateUserLastName);

router.post('/verify-otp', verifyEmailOTP);
router.post('/resend-otp', resendEmailOTP);

export default router;
