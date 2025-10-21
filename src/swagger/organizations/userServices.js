/**
 * @swagger
 * tags:
 *   name: User Services
 *   description: APIs related to organizations for users (User Only)
 */

/**
 * @swagger
 * /api/v1/organizations/{pincode}:
 *   get:
 *     summary: Fetch organizations by pincode
 *     description: Retrieve a list of organizations filtered by the given pincode.
 *     tags: [User Services]
 *     parameters:
 *       - in: path
 *         name: pincode
 *         required: true
 *         schema:
 *           type: integer
 *           example: 400001
 *         description: The postal code to filter organizations
 *     responses:
 *       200:
 *         description: Organizations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organizations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       organizationName:
 *                         type: string
 *                         example: moveryy packers and movers
 *                       organizationType:
 *                         type: string
 *                         example: home shift, office shifts, car shifts
 *                       businessName:
 *                         type: string
 *                         example: moveryy transports pvt ltd
 *                       about:
 *                         type: string
 *                         example: your moving partner
 *                       domain:
 *                         type: string
 *                         example: moveryy.com
 *                       subdomain:
 *                         type: string
 *                         example: moveryy
 *                       logo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       phone:
 *                         type: string
 *                         example: +911234567890
 *                       email:
 *                         type: string
 *                         example: moveryy@moveryy.com
 *                       country:
 *                         type: string
 *                         example: india
 *                       state:
 *                         type: string
 *                         example: maharashtra
 *                       city:
 *                         type: string
 *                         example: mumbai
 *                       pincode:
 *                         type: integer
 *                         example: 400001
 *                       addressLine1:
 *                         type: string
 *                         example: 123, business street
 *                       addressLine2:
 *                         type: string
 *                         example: 5th floor, office 501
 *                       longitude:
 *                         type: number
 *                         format: float
 *                         nullable: true
 *                         example: null
 *                       latitude:
 *                         type: number
 *                         format: float
 *                         nullable: true
 *                         example: null
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-04T13:47:19.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-06T07:46:48.000Z"
 *       400:
 *         description: Invalid pincode supplied
 *       404:
 *         description: No organizations found for the given pincode
 */


/**
 * @swagger
 * /api/v1/organizations/org/{organizationId}:
 *   get:
 *     summary: Fetch organization by ID
 *     description: Retrieve the details of a single organization using its ID.
 *     tags: [User Services]
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 13
 *         description: The ID of the organization to fetch
 *     responses:
 *       200:
 *         description: Organization fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 13
 *                     userId:
 *                       type: integer
 *                       example: 3
 *                     organizationName:
 *                       type: string
 *                       example: aggarwal packers & transports
 *                     organizationType:
 *                       type: string
 *                       example: home shift, office shifts, car shifts
 *                     businessName:
 *                       type: string
 *                       example: aggarwal transports pvt ltd
 *                     about:
 *                       type: string
 *                       example: your moving partner
 *                     domain:
 *                       type: string
 *                       example: newaggarwal1.com
 *                     subdomain:
 *                       type: string
 *                       example: newaggarwal1
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: +911234567873
 *                     email:
 *                       type: string
 *                       example: aggarwal2@gmail.com
 *                     country:
 *                       type: string
 *                       example: india
 *                     state:
 *                       type: string
 *                       example: maharashtra
 *                     city:
 *                       type: string
 *                       example: mumbai
 *                     pincode:
 *                       type: integer
 *                       example: 400001
 *                     addressLine1:
 *                       type: string
 *                       example: 123, business street
 *                     addressLine2:
 *                       type: string
 *                       example: 5th floor, office 501
 *                     longitude:
 *                       type: number
 *                       format: float
 *                       nullable: true
 *                       example: null
 *                     latitude:
 *                       type: number
 *                       format: float
 *                       nullable: true
 *                       example: null
 *                     status:
 *                       type: string
 *                       example: inactive
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T10:49:53.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-15T10:49:53.000Z"
 *       400:
 *         description: Invalid organization ID supplied
 *       404:
 *         description: Organization not found
 */ 


/**
 * @swagger
 * /api/v1/vehicles/available?organizationId=10&serviceType=houseshift&capacityValue=2&capacityUnit=bhk:
 *   get:
 *     summary: Fetch available vehicles with pricing based on service type and capacity
 *     description: >
 *       Retrieve a list of all vehicles under a given organization that match the selected
 *       service type and capacity conditions. Pricing is determined based on the service,
 *       capacity range, and organization — not vehicle type.
 *     tags: [User Services]
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The ID of the organization whose vehicles you want to fetch.
 *       - in: query
 *         name: serviceType
 *         required: true
 *         schema:
 *           type: string
 *           example: houseshift
 *         description: The service type selected by the user (e.g., houseshift, officeshift, carshift).
 *       - in: query
 *         name: capacityValue
 *         required: true
 *         schema:
 *           type: number
 *           example: 2
 *         description: The capacity value selected by the user (e.g., number of BHK, tons, etc.).
 *       - in: query
 *         name: capacityUnit
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bhk, tons, cubic_meters]
 *           example: bhk
 *         description: The unit for the selected capacity.
 *     responses:
 *       200:
 *         description: Vehicles with pricing fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Vehicles with pricing fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleId:
 *                         type: integer
 *                         example: 3
 *                       vehicleName:
 *                         type: string
 *                         example: Tata Magic
 *                       vehicleType:
 *                         type: string
 *                         example: truck
 *                       registrationNumber:
 *                         type: string
 *                         example: DL1AB1654
 *                       manufacturer:
 *                         type: string
 *                         example: Tata Motors
 *                       capacityValue:
 *                         type: number
 *                         example: 2
 *                       capacityUnit:
 *                         type: string
 *                         example: bhk
 *                       serviceType:
 *                         type: string
 *                         example: houseshift
 *                       status:
 *                         type: string
 *                         example: available
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       pricingPlan:
 *                         type: object
 *                         properties:
 *                           pricingPlanId:
 *                             type: integer
 *                             example: 2
 *                           organizationId:
 *                             type: integer
 *                             example: 10
 *                           serviceType:
 *                             type: string
 *                             example: houseshift
 *                           vehicleType:
 *                             type: string
 *                             example: van
 *                           minCapacity:
 *                             type: number
 *                             example: 1
 *                           maxCapacity:
 *                             type: number
 *                             example: 3
 *                           capacityUnit:
 *                             type: string
 *                             example: bhk
 *                           baseRate:
 *                             type: number
 *                             example: 1500
 *                           pricePerKm:
 *                             type: number
 *                             example: 25
 *                           surgeCharges:
 *                             type: number
 *                             example: 0.08
 *       400:
 *         description: Missing or invalid query parameters
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Access forbidden (only users can call this endpoint)
 *       404:
 *         description: No vehicles or pricing plans found for the given filters
 */
