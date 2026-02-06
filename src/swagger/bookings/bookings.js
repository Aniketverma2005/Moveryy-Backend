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


/**
 * @swagger
 * /api/v1/employee/bookings:
 *   get:
 *     summary: Fetch bookings assigned to logged-in employee
 *     description:
 *       Fetches all bookings assigned to the authenticated employee (driver or crew)
 *       using the employee access token. Employees can only see bookings they are
 *       assigned to.
 *     tags: [Employee Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bookings fetched successfully
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookingId:
 *                         type: integer
 *                         example: 12
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       customerId:
 *                         type: integer
 *                         example: 1
 *                       vehicleId:
 *                         type: integer
 *                         example: 7
 *                       serviceType:
 *                         type: string
 *                         example: houseshift
 *                       capacityValue:
 *                         type: integer
 *                         example: 1
 *                       capacityUnit:
 *                         type: string
 *                         example: bhk
 *                       startLocation:
 *                         type: string
 *                         example: Indore, MP
 *                       endLocation:
 *                         type: string
 *                         example: Bhopal, MP
 *                       distance:
 *                         type: number
 *                         example: 195
 *                       tripDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-01-20T00:00:00.000Z
 *                       baseRate:
 *                         type: number
 *                         example: 1500
 *                       distanceCost:
 *                         type: number
 *                         example: 4875
 *                       fuelSurcharge:
 *                         type: number
 *                         example: 390
 *                       totalPrice:
 *                         type: number
 *                         example: 6765
 *                       discount:
 *                         type: number
 *                         example: 0
 *                       finalPrice:
 *                         type: number
 *                         example: 6765
 *                       bookingStatus:
 *                         type: string
 *                         example: pending
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicleId:
 *                             type: integer
 *                             example: 7
 *                           vehicleName:
 *                             type: string
 *                             example: Tata Ace
 *                           capacityValue:
 *                             type: integer
 *                             example: 1
 *                           capacityUnit:
 *                             type: string
 *                             example: bhk
 *                           status:
 *                             type: string
 *                             example: on-duty
 *                       pricingplan:
 *                         type: object
 *                         properties:
 *                           pricingPlanId:
 *                             type: integer
 *                             example: 2
 *                           serviceType:
 *                             type: string
 *                             example: houseshift
 *                           baseRate:
 *                             type: number
 *                             example: 1500
 *                           pricePerKm:
 *                             type: number
 *                             example: 25
 *                       bookingCrews:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             bookingCrewId:
 *                               type: integer
 *                               example: 3
 *                             employeeId:
 *                               type: integer
 *                               example: 13
 *                             role:
 *                               type: string
 *                               example: driver
 *                             status:
 *                               type: string
 *                               example: assigned
 *                             employee:
 *                               type: object
 *                               properties:
 *                                 employeeId:
 *                                   type: integer
 *                                   example: 13
 *                                 employeeName:
 *                                   type: string
 *                                   example: Divyanshu Rajawat
 *                                 role:
 *                                   type: string
 *                                   example: driver
 *                                 phone:
 *                                   type: string
 *                                   example: +918773523345
 *       401:
 *         description: Unauthorized or invalid employee token
 *       403:
 *         description: Access denied (not a driver or crew)
 *       500:
 *         description: Internal server error
 */
