/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and login routes
 */

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: Authenticate user and issue JWT
 *     description: Logs in a user with their email and password, returning user details, tokens, and organization info.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aniket@moveryy.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: MyStrongPassword123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         firstName:
 *                           type: string
 *                           example: aniket
 *                         lastName:
 *                           type: string
 *                           example: verma
 *                         email:
 *                           type: string
 *                           example: aniket@moveryy.com
 *                         phone:
 *                           type: string
 *                           example: +918776352434
 *                         role:
 *                           type: string
 *                           example: admin
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-09-27T11:49:45.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-05T12:51:51.000Z"
 *                     activeOrganization:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid request (missing fields or password too short)
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: User is blocked
 *       404:
 *         description: User not found
 *       410:
 *         description: User account deleted
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs the user out completely from the platform.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful logout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged out successfully
 *                 data:
 *                   type: object
 *                   example: {}
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */

/**
 * @swagger
 * /api/v1/organizations/switch:
 *   post:
 *     summary: Switch active organization (admin only)
 *     description: Activates a specific organization for the logged-in admin and issues new access and refresh tokens scoped to that organization.
 *     tags:
 *       - Auth
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
 *             properties:
 *               organizationId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Organization switched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Organization 'moveryy transports' activated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     organizationName:
 *                       type: string
 *                       example: moveryy transports
 *                     organizationType:
 *                       type: string
 *                       example: home shift, office shifts, car shifts
 *                     businessName:
 *                       type: string
 *                       example: moveryy transports pvt ltd
 *                     about:
 *                       type: string
 *                       example: your moving partner
 *                     domain:
 *                       type: string
 *                       example: moveryy.com
 *                     subdomain:
 *                       type: string
 *                       example: moveryy
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: +911234567890
 *                     email:
 *                       type: string
 *                       example: moveryy@moveryy.com
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
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-04T13:47:19.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-05T13:15:28.790Z"
 *                 token:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid request (missing or invalid organizationId)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       404:
 *         description: Organization not found
 *       403:
 *         description: User does not have permission to access this organization
 *       500:
 *         description: Internal server error
 */

