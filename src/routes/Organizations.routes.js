import { Router } from "express";
import { verifyNewGeneratedToken, verifyToken } from "../middlewares/Auth.middleware.js";
import { createOrganization, deleteOrganization, fetchOrganizationById, fetchOrganizationByPin, fetchOrganizations, organizationStatus, updateOrganization } from "../controllers/Organization.controllers.js";
import activeOrganization from "../middlewares/ActiveOrganization.js";

const router = Router();

//Check if the user is authenticated before accessing any routes
router.use(verifyToken);

router.route('/create').post(createOrganization)

router.route('/all').get(verifyToken, fetchOrganizations)

router.route('/switch').post(verifyToken, organizationStatus)

router.route('/update').patch(verifyNewGeneratedToken, updateOrganization)

router.route('/:organizationId').delete(verifyNewGeneratedToken, deleteOrganization)

router.route('/:pincode').get(verifyToken, fetchOrganizationByPin)

router.route('/org/:organizationId').get(verifyToken, fetchOrganizationById)

export default router;

