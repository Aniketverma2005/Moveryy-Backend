import { Router } from 'express';
import { extractDL, extractPAN, extractAadhar } from '../../controllers/RideHailing/OCR.controllers.js';
import { verifyIndependentDriverToken } from '../../middlewares/Auth.middleware.js';

const router = Router();

// All OCR routes require driver authentication
// Driver's access token is used to save data to their own record only
router.post('/extract-dl', verifyIndependentDriverToken, extractDL);
router.post('/extract-pan', verifyIndependentDriverToken, extractPAN);
router.post('/extract-aadhar', verifyIndependentDriverToken, extractAadhar);

export default router;
