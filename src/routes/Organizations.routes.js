import { Router } from "express";
import { verifyNewGeneratedToken, verifyToken } from "../middlewares/Auth.middleware.js";
import { createOrganization, deleteOrganization, fetchOrganizationById, fetchOrganizationByPin, fetchOrganizations, organizationStatus, updateOrganization, logoUpload, uploadOrganizationLogo, fetchOrganizationLogo } from "../controllers/Organization.controllers.js";
import activeOrganization from "../middlewares/ActiveOrganization.js";

const router = Router();

router.use(verifyToken);

// Specific routes MUST come before dynamic routes
router.route('/create').post(logoUpload.single('logo'), createOrganization)
router.route('/all').get(verifyToken, fetchOrganizations)
router.route('/switch').post(verifyToken, organizationStatus)
router.route('/update').patch(verifyNewGeneratedToken, updateOrganization)
router.route('/upload-logo/:organizationId').patch(verifyNewGeneratedToken, uploadOrganizationLogo)
router.route('/logo/:organizationId').get(verifyToken, fetchOrganizationLogo)
router.route('/org/:organizationId').get(verifyToken, fetchOrganizationById)

// Dynamic routes MUST come LAST
router.route('/:organizationId').delete(verifyNewGeneratedToken, deleteOrganization)
router.route('/:pincode').get(verifyToken, fetchOrganizationByPin)

export default router;

