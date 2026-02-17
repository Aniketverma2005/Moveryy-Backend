import express from "express";

import userRoutes from "./Users/user.routes.js";
import addressRoutes from "./Users/Address.routes.js";
import organizationRoutes from "./Organizations.routes.js";
import employeeRoutes from "./Employee.routes.js";
import vehicleRoutes from "./Vehicles.routes.js";
import offersRoutes from "./Offers.routes.js";
import vehicleOffersRoutes from "./VehiclesOffer.routes.js";
import pricingPlanRoutes from "./PricingPlan.routes.js";
import bookingRoutes from "./Bookings/Bookings.routes.js";
import bookingCrew from "./Employee/BookingCrew.routes.js";
import independentDriverRoutes from "./RideHailing/IndependentDriver.routes.js";
import rideVehicleRoutes from "./RideHailing/RideVehicle.routes.js";

const router = express.Router();

router.use("/users", userRoutes);
router.use("/address", addressRoutes);
router.use("/organizations", organizationRoutes);
router.use("/employee", employeeRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/offers", offersRoutes);
router.use("/vehiclesOffer", vehicleOffersRoutes);
router.use("/pricingPlan", pricingPlanRoutes);
router.use("/bookings", bookingRoutes);
router.use("/bookingCrew", bookingCrew);
router.use("/drivers", independentDriverRoutes);
router.use("/drivers/vehicle", rideVehicleRoutes);

export default router;
