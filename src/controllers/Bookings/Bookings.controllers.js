import { asyncHandler } from "../../utils/asyncHandler.js";
import Bookings from "../../models/Bookings/Bookings.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { Validation } from "../../utils/Validation.js";
import Organizations from "../../models/Organizations.js";
import Vehicles from "../../models/Vehicles.js";
import PricingPlans from "../../models/PricingPlans.js";
import Offers from "../../models/Offers.js";
import VehicleOffers from "../../models/VehiclesOffer.js";
import { Op } from "sequelize"; 
import Employees from "../../models/Employee/Employee.js";
import BookingCrew from "../../models/Employee/BookingCrew.js";

export const createBooking = async (req, res) => {
  try {
    const {
      organizationId,
      customerId,
      vehicleId,
      offerId,
      vehicleOfferId,
      serviceType,
      startLocation,
      endLocation,
      distance,
      tripDate
    } = req.body;

    
    if (!organizationId || !vehicleId || !serviceType ||
        !startLocation || !endLocation || !distance || !tripDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const vehicle = await Vehicles.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const pricingPlan = await PricingPlans.findOne({
      where: {
        organizationId,
        serviceType: serviceType.toLowerCase(),
        capacityUnit: vehicle.capacityUnit.toLowerCase(),
        minCapacity: { [Op.lte]: vehicle.capacityValue },
        maxCapacity: { [Op.gte]: vehicle.capacityValue }
      }
    });

    if (!pricingPlan) {
      return res.status(404).json({
        message: "No pricing plan found for this service type or capacity"
      });
    }

  
    const baseRate = pricingPlan.baseRate;
    const pricePerKm = pricingPlan.pricePerKm;
    const surgeCharges = pricingPlan.surgeCharges;

    const distanceCost = distance * pricePerKm;
    const surgeChargeCost = distanceCost * surgeCharges;

    let totalPrice = baseRate + distanceCost + surgeChargeCost;

    // 4️⃣ Apply offers
    let discount = 0;

    if (offerId) {
      const offer = await Offers.findByPk(offerId);
      if (offer) discount += (offer.discountPercent / 100) * totalPrice;
    }

    if (vehicleOfferId) {
      const vOffer = await VehicleOffers.findByPk(vehicleOfferId);
      if (vOffer) discount += (vOffer.discountPercent / 100) * totalPrice;
    }

    const finalPrice = totalPrice - discount;

    // 5️⃣ Create Booking
    const booking = await Bookings.create({
      organizationId,
      customerId,
      vehicleId,
      pricingPlanId: pricingPlan.pricingPlanId,
      offerId,
      vehicleOfferId,
      serviceType,
      startLocation,
      endLocation,
      distance,
      tripDate,
      baseRate,
      distanceCost,
      fuelSurcharge: surgeChargeCost,
      totalPrice,
      discount,
      finalPrice,
      bookingStatus: "pending"
    });

    // ------------------------------------------------------
    // 6️⃣ ASSIGN DRIVER (from vehicle.driverId)
    // ------------------------------------------------------

    const assignedDriverId = vehicle.driverId;

    if (!assignedDriverId) {
      return res.status(400).json({
        message: "No driver assigned to this vehicle."
      });
    }

    const driver = await Employees.findByPk(assignedDriverId);

    if (!driver || driver.status !== "available") {
      return res.status(400).json({
        message: "Assigned driver is not available"
      });
    }

    // Save driver in bookingCrew table
    await BookingCrew.create({
      bookingId: booking.bookingId,
      employeeId: assignedDriverId,
      role: "driver"
    });

    // Update driver status
    await Employees.update(
      { status: "busy" },
      { where: { employeeId: assignedDriverId } }
    );

    // ------------------------------------------------------
    // 7️⃣ ASSIGN CREW MEMBERS
    // ------------------------------------------------------

    function requiredCrew(cap) {
      if (cap === 1) return 2;
      if (cap === 2) return 3;
      if (cap >= 3) return 4;
      return 2;
    }

    const crewNeeded = requiredCrew(vehicle.capacityValue);

    const availableCrew = await Employees.findAll({
      where: {
        organizationId,
        role: "crew",
        status: "available",
        isActive: true,
        isBlacklisted: false
      },
      limit: crewNeeded
    });

    if (availableCrew.length < crewNeeded) {
      return res.status(400).json({
        message: "Not enough crew members available"
      });
    }

    // Assign each crew member
    for (let crewMember of availableCrew) {
      await BookingCrew.create({
        bookingId: booking.bookingId,
        employeeId: crewMember.employeeId,
        role: "crew"
      });

      await Employees.update(
        { status: "busy" },
        { where: { employeeId: crewMember.employeeId } }
      );
    }

    // ------------------------------------------------------
    // 8️⃣ UPDATE VEHICLE STATUS
    // ------------------------------------------------------
    await Vehicles.update(
      { status: "on-duty" },
      { where: { vehicleId } }
    );

    return res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.error("BOOKING ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};





export const checkoutPreview = async (req, res) => {
  try {
    const {
      organizationId,
      vehicleId,
      serviceType,
      distance,
      offerId,
      vehicleOfferId
    } = req.body;

    // VALIDATION
    if (!organizationId || !vehicleId || !distance || !serviceType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ FETCH VEHICLE
    const vehicle = await Vehicles.findByPk(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // 2️⃣ FETCH MATCHING PRICING PLAN
    const pricingPlan = await PricingPlans.findOne({
      where: {
        organizationId,
        serviceType: serviceType.toLowerCase(),
        capacityUnit: vehicle.capacityUnit.toLowerCase(),
        minCapacity: { [Op.lte]: vehicle.capacityValue },
        maxCapacity: { [Op.gte]: vehicle.capacityValue }
      }
    });

    if (!pricingPlan) {
      return res.status(404).json({
        message: "No pricing plan found for this vehicle capacity or service type"
      });
    }

    // 3️⃣ PRICE CALCULATION
    const baseRate = pricingPlan.baseRate;
    const pricePerKm = pricingPlan.pricePerKm;
    const surgeCharges = pricingPlan.surgeCharges;

    const distanceCost = distance * pricePerKm;
    const surgeChargeCost = distanceCost * surgeCharges;
    let totalPrice = baseRate + distanceCost + surgeChargeCost;

    // 4️⃣ APPLY OFFERS
    let discount = 0;

    if (offerId) {
      const offer = await Offers.findByPk(offerId);
      if (offer) discount += (offer.discountPercent / 100) * totalPrice;
    }

    if (vehicleOfferId) {
      const vOffer = await VehicleOffers.findByPk(vehicleOfferId);
      if (vOffer) discount += (vOffer.discountPercent / 100) * totalPrice;
    }

    const finalPrice = totalPrice - discount;

    // 5️⃣ SEND RESPONSE
    return res.status(200).json({
      message: "Checkout data generated",
      vehicle,
      pricingPlan,
      baseRate,
      distanceCost,
      surgeChargeCost,
      totalPrice,
      discount,
      finalPrice
    });

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};
