import { Router } from "express";
import { verifyToken } from "../middlewares/Auth.middleware.js";
import { createOrganization, deleteOrganization, fetchOrganizations, organizationStatus, updateOrganization } from "../controllers/Organization.controllers.js";
import activeOrganization from "../middlewares/ActiveOrganization.js";

const router = Router();

//Check if the user is authenticated before accessing any routes
router.use(verifyToken);

//Create a new organization
//[POST]http://localhost:5000/api/v1/organizations/create
router.route('/create').post(verifyToken, createOrganization)

//Get all organizations of the logged in user
//[GET]http://localhost:5000/api/v1/organizations/all
router.route('/all').get(verifyToken, fetchOrganizations)

//Update organization status (active/inactive)
//[POST]http://localhost:5000/api/v1/organizations/status
router.route('/status').post(verifyToken, organizationStatus)

//Update organization details
//[PATCH]http://localhost:5000/api/v1/organizations/update
router.route('/update').patch(verifyToken, activeOrganization, updateOrganization)


//Delete an organization
//[DELETE]http://localhost:5000/api/v1/organizations/:organizationId
router.route('/:organizationId').delete(verifyToken, activeOrganization, deleteOrganization)

export default router;

// {
//   "employeeName":"Raju",
//   "email":"rajukumar@gmail.com",
//   "password":"Raju@123",
//   "role":"transport",
//   "gender":"male",
//   "address":"New Delhi, Hauz Khas",
//   "phone":"+918773523452",
//   "aadharNumber":"123456789012",
//   "panNumber":"AF45FDA"
  
// }