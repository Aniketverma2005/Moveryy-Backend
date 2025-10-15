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
