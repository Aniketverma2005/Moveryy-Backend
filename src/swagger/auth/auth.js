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
 *     description: |
 *       Logs in a user with their email and password.  
 *       
 *       This endpoint returns user details, access and refresh tokens, and organization-related information.  
 *       
 *       **Important Notes:**
 *       - If `organizationStatus` is **SINGLE_ORG**, the user already has an active organization and does **not need to switch**.  
 *       - If `organizationStatus` is **MULTI_ORG**, the user is associated with multiple organizations and must **switch organization** to get a new active token tied to that organization.  
 *       - If `needsOrganizationSetup` is **true**, the user **has not yet created any organization** and must complete the organization setup process before proceeding.  
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
 *                           example: "2025-10-05T13:59:50.000Z"
 *                     activeOrganization:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         organizationId:
 *                           type: integer
 *                           example: 10
 *                         name:
 *                           type: string
 *                           example: moveryy packers and movers
 *                         status:
 *                           type: string
 *                           example: active
 *                     organizationStatus:
 *                       type: string
 *                       enum: [SINGLE_ORG, MULTI_ORG]
 *                       example: SINGLE_ORG
 *                       description: |
 *                         - **SINGLE_ORG**: User has a single active organization and does not need to switch.
 *                         - **MULTI_ORG**: User is part of multiple organizations and must switch to get a new active token.
 *                     needsOrganizationSetup:
 *                       type: boolean
 *                       example: false
 *                       description: |
 *                         Indicates whether the user needs to set up an organization.
 *                         If `true`, user has not yet created any organization and must complete setup.
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

/**
 * @swagger
 * /api/v1/users/verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     description: |
 *       Verifies the OTP sent to user's email during registration.
 *       Upon successful verification, the user account is created and email is marked as verified.
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
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aniket@moveryy.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: Email verified successfully! You can now login.
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: aniket@moveryy.com
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/users/resend-otp:
 *   post:
 *     summary: Resend email OTP
 *     description: |
 *       Resends the OTP to user's email if the previous OTP expired or was not received.
 *       Can only be used for pending registrations (users who haven't verified their email yet).
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aniket@moveryy.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
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
 *                   example: OTP sent to your email
 *                 data:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: User already verified or invalid email
 *       404:
 *         description: No pending registration found for this email
 *       500:
 *         description: Failed to send OTP email
 */

