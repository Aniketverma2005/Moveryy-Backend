import { Router } from "express";
import { verifyToken } from "../../middlewares/Auth.middleware.js";
import { addAddress, deleteAddress, getAddressById, getAddresses, updateAddress } from "../../controllers/Users/Address.controllers.js";

const router = Router();

router.route('/').post(verifyToken, addAddress);

router.route('/').get(verifyToken, getAddresses);

router.route('/:addressId').get(verifyToken, getAddressById);

router.route('/:addressId').patch(verifyToken, updateAddress);

router.route('/:addressId').delete(verifyToken, deleteAddress);

export default router;