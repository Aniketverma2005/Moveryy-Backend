import { Router } from "express";
import { 
  addVehicle,
  getDriverVehicle,
  updateVehicle,
  deleteVehicle,
  checkVehicleStatus
} from "../../controllers/RideHailing/RideVehicle.controllers.js";
import { verifyIndependentDriverToken } from "../../middlewares/Auth.middleware.js";

const router = Router();

// All routes require driver authentication
router.use(verifyIndependentDriverToken);

// Vehicle management routes
router.route('/add').post(addVehicle);
router.route('/').get(getDriverVehicle);
router.route('/:vehicleId').patch(updateVehicle);
router.route('/:vehicleId').delete(deleteVehicle);
router.route('/status/check').get(checkVehicleStatus);

export default router;
