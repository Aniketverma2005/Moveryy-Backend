import Bookings from "../../models/Bookings/Bookings.js";
import Vehicles from "../../models/Vehicles.js";
import PricingPlans from "../../models/PricingPlans.js";
import Offers from "../../models/Offers.js";
import VehicleOffers from "../../models/VehiclesOffer.js";
import { Op } from "sequelize"; 
import Employees from "../../models/Employee/Employee.js";
import BookingCrew from "../../models/Employee/BookingCrew.js";
import sequelize from "../../database/db.js";
import getCrewCount from "../../utils/CrewAssigned.js";
import { Organizations } from "../../models/index.js";


export const createBooking = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const {
      organizationId,
      vehicleId,
      offerId,
      vehicleOfferId,
      serviceType,
      startLocation,
      endLocation,
      distance,
      tripDate,
      capacityValue,
      capacityUnit
    } = req.body;

    // ---------------- VALIDATION ----------------
    if (
      !organizationId ||
      !vehicleId ||
      !serviceType ||
      !startLocation ||
      !endLocation ||
      !distance ||
      !tripDate ||
      !capacityValue ||
      !capacityUnit
    ) {
      throw new Error("Missing required fields");
    }

    const organization = await Organizations.findByPk(organizationId, { transaction: t });

    if (!organization) {
      throw new Error("Organization not found");
    }

    if (organization.status?.toLowerCase() !== "active") {
      throw new Error("Organization is inactive");
    }




    // ORGANIZATION FROM TOKEN (NOT BODY)
    const customerId = req.user.id;
    if (!organizationId) {
      throw new Error("Unauthorized organization");
    }

    // ---------------- FETCH VEHICLE ----------------
    const vehicle = await Vehicles.findOne({
      where: {
        vehicleId,
        organizationId
      },
      transaction: t
    });

    if (!vehicle) {
      throw new Error("Vehicle not found for selected organization");
    }

    

    if (capacityValue > vehicle.capacityValue) {
      throw new Error("Selected capacity exceeds vehicle capacity");
    }

    // ---------------- FETCH PRICING PLAN ----------------
    const pricingPlan = await PricingPlans.findOne({
      where: {
        organizationId,
        serviceType: serviceType.toLowerCase(),
        capacityUnit: capacityUnit.toLowerCase(),
        minCapacity: { [Op.lte]: capacityValue },
        maxCapacity: { [Op.gte]: capacityValue }
      },
      transaction: t
    });

    if (!pricingPlan) {
      throw new Error("No pricing plan found for selected capacity and service");
    }

    // ---------------- PRICE CALCULATION ----------------
    const baseRate = pricingPlan.baseRate;
    const pricePerKm = pricingPlan.pricePerKm;
    const surgeCharges = pricingPlan.surgeCharges || 0;

    const distanceCost = distance * pricePerKm;
    const surgeChargeCost = distanceCost * surgeCharges;
    let totalPrice = baseRate + distanceCost + surgeChargeCost;

    // ---------------- APPLY OFFERS ----------------
    let discount = 0;

    if (offerId) {
      const offer = await Offers.findByPk(offerId, { transaction: t });
      if (offer?.isActive) {
        discount += offer.discountType === "percentage"
          ? (offer.discountValue / 100) * totalPrice
          : offer.discountValue;
      }
    }

    if (vehicleOfferId) {
      const vOffer = await VehicleOffers.findByPk(vehicleOfferId, { transaction: t });
      if (vOffer?.isActive) {
        discount += vOffer.discountType === "percentage"
          ? (vOffer.discountValue / 100) * totalPrice
          : vOffer.discountValue;
      }
    }

    discount = Math.min(discount, totalPrice);
    const finalPrice = totalPrice - discount;

    // ---------------- CREATE BOOKING ----------------
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
      capacityValue,
      capacityUnit,
      baseRate,
      distanceCost,
      fuelSurcharge: surgeChargeCost,
      totalPrice,
      discount,
      finalPrice,
      bookingStatus: "pending"
    }, { transaction: t });

    // ---------------- ASSIGN DRIVER ----------------
    if (!vehicle.driverId) {
      throw new Error("No driver assigned to this vehicle");
    }

    const driver = await Employees.findOne({
      where: { employeeId: vehicle.driverId, status: "available" },
      transaction: t
    });

    if (!driver) throw new Error("Assigned driver is not available");

    await BookingCrew.create({
      bookingId: booking.bookingId,
      employeeId: driver.employeeId,
      role: "driver"
    }, { transaction: t });

    await driver.update({ status: "busy" }, { transaction: t });

    // ---------------- ASSIGN CREW ----------------
    const crewNeeded = getCrewCount(
      serviceType,
      capacityValue,
      capacityUnit
    );


    const availableCrew = await Employees.findAll({
      where: {
        organizationId,
        status: "available",
        isActive: true,
        isBlacklisted: false,
        role: { [Op.ne]: "driver" }
      },
      limit: crewNeeded,
      transaction: t
    });

    if (availableCrew.length < crewNeeded) {
      throw new Error("Not enough crew members available");
    }

    for (const crew of availableCrew) {
      await BookingCrew.create({
        bookingId: booking.bookingId,
        employeeId: crew.employeeId,
        role: "crew"
      }, { transaction: t });

      await crew.update({ status: "busy" }, { transaction: t });
    }

    // ---------------- UPDATE VEHICLE ----------------
    await vehicle.update({ status: "on-duty" }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      message: "Booking created successfully with driver and crew assigned",
      bookingId: booking.bookingId
    });

  } catch (error) {
    await t.rollback();
    console.error("BOOKING ERROR:", error);
    return res.status(400).json({ message: error.message });
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


export const getOrganizationBookings = async (req, res) => {
  try {
    const organizationId = req.user.organizationId;

    if (!organizationId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Bookings.findAll({
      where: { organizationId },

      order: [["createdAt", "DESC"]],

      include: [
        {
          model: Vehicles,
          attributes: ["vehicleId", "vehicleName", "capacityValue", "capacityUnit", "status"]
        },
        {
          model: PricingPlans,
          attributes: ["pricingPlanId", "serviceType", "baseRate", "pricePerKm"]
        },
        {
          model: Offers,
          attributes: ["offerId", "offerName", "discountValue", "discountType"],
          required: false
        },
        {
          model: VehicleOffers,
          attributes: ["vehicleOfferId", "offerName", "discountValue", "discountType"],
          required: false
        },
        {
          model: BookingCrew,
          include: [
            {
              model: Employees,
              attributes: ["employeeId", "employeeName", "role", "phone"]
            }
          ]
        }
      ]

    });

    return res.status(200).json({
      message: "Bookings fetched successfully",
      total: bookings.length,
      bookings
    });

  } catch (error) {
    console.error("FETCH BOOKINGS ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

