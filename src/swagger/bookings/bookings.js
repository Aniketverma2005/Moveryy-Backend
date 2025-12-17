/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: Booking operations (pricing preview & booking creation)
 */

/**
 * @swagger
 * /api/v1/bookings/checkout:
 *   post:
 *     summary: Generate checkout preview details before booking
 *     description: 
 *       Calculates the price for the selected vehicle using pricing plan, distance, surge charges, and applicable offers. 
 *       This does NOT create a booking — only returns preview data.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - vehicleId
 *               - serviceType
 *               - distance
 *             properties:
 *               organizationId:
 *                 type: integer
 *                 example: 10
 *               vehicleId:
 *                 type: integer
 *                 example: 4
 *               serviceType:
 *                 type: string
 *                 example: houseshift
 *               distance:
 *                 type: number
 *                 example: 18.4
 *               offerId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               vehicleOfferId:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *     responses:
 *       200:
 *         description: Checkout preview generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Checkout data generated
 *                 vehicle:
 *                   type: object
 *                   example:
 *                     vehicleId: 4
 *                     vehicleName: Mahindra Camper
 *                     capacityValue: 3
 *                     capacityUnit: bhk
 *                     serviceType: houseshift
 *                 pricingPlan:
 *                   type: object
 *                   example:
 *                     pricingPlanId: 2
 *                     baseRate: 1500
 *                     pricePerKm: 25
 *                     surgeCharges: 0.08
 *                 baseRate:
 *                   type: number
 *                   example: 1500
 *                 distanceCost:
 *                   type: number
 *                   example: 460
 *                 surgeChargeCost:
 *                   type: number
 *                   example: 36.8
 *                 totalPrice:
 *                   type: number
 *                   example: 1996.8
 *                 discount:
 *                   type: number
 *                   example: 0
 *                 finalPrice:
 *                   type: number
 *                   example: 1996.8
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: No matching pricing plan found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/bookings/create:
 *   post:
 *     summary: Create a new booking
 *     description: 
 *       Creates a booking after calculating pricing using the selected vehicle, pricing plan, surge, offers, and distance. 
 *       Also auto-updates the vehicle status to "on-duty".
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - vehicleId
 *               - serviceType
 *               - startLocation
 *               - endLocation
 *               - distance
 *               - tripDate
 *             properties:
 *               organizationId:
 *                 type: integer
 *                 example: 10
 *               vehicleId:
 *                 type: integer
 *                 example: 4
 *               customerId:
 *                 type: integer
 *                 example: 22
 *               employeeId:
 *                 type: integer
 *                 example: 5
 *               offerId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               vehicleOfferId:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *               serviceType:
 *                 type: string
 *                 example: houseshift
 *               startLocation:
 *                 type: string
 *                 example: Delhi
 *               endLocation:
 *                 type: string
 *                 example: Gurgaon
 *               distance:
 *                 type: number
 *                 example: 18.4
 *               tripDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-20T09:00:00.000Z
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Booking created successfully
 *                 booking:
 *                   type: object
 *                   properties:
 *                     bookingId:
 *                       type: integer
 *                       example: 12
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     vehicleId:
 *                       type: integer
 *                       example: 4
 *                     pricingPlanId:
 *                       type: integer
 *                       example: 2
 *                     baseRate:
 *                       type: number
 *                       example: 1500
 *                     distanceCost:
 *                       type: number
 *                       example: 460
 *                     fuelSurcharge:
 *                       type: number
 *                       example: 36.8
 *                     totalPrice:
 *                       type: number
 *                       example: 1996.8
 *                     discount:
 *                       type: number
 *                       example: 0
 *                     finalPrice:
 *                       type: number
 *                       example: 1996.8
 *                     bookingStatus:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: Missing required fields or invalid input
 *       404:
 *         description: Vehicle or pricing plan not found
 *       500:
 *         description: Internal server error
 */
