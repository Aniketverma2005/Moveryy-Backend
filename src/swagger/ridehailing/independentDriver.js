/**
 * @swagger
 * tags:
 *   - name: Independent Drivers
 *     description: Independent driver registration and management for ride-hailing services
 *
 * /api/v1/drivers/register:
 *   post:
 *     summary: Register a new independent driver
 *     description: Allows an independent driver to register for ride-hailing services. Registration requires admin approval before the driver can login.
 *     tags: [Independent Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *               - phone
 *               - gender
 *               - address
 *               - city
 *               - state
 *               - pincode
 *               - licenseNumber
 *               - licenseExpiry
 *               - licenseType
 *               - aadharNumber
 *               - panNumber
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Rajesh Kumar
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rajesh.driver@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Rajesh@123
 *               phone:
 *                 type: string
 *                 pattern: '^\+[0-9]{7,15}$'
 *                 example: +919876543210
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-15
 *               gender:
 *                 type: string
 *                 enum: [male, female, others]
 *                 example: male
 *               address:
 *                 type: string
 *                 example: 123, MG Road, Sector 15
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               pincode:
 *                 type: string
 *                 example: 400001
 *               licenseNumber:
 *                 type: string
 *                 example: MH0120230012345
 *               licenseExpiry:
 *                 type: string
 *                 format: date
 *                 example: 2028-12-31
 *               licenseType:
 *                 type: string
 *                 enum: [two_wheeler, four_wheeler, commercial]
 *                 example: commercial
 *               aadharNumber:
 *                 type: string
 *                 minLength: 12
 *                 maxLength: 12
 *                 example: 123456789012
 *               panNumber:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10
 *                 example: ABCDE1234F
 *               bankAccountNumber:
 *                 type: string
 *                 example: 1234567890123456
 *               bankIfscCode:
 *                 type: string
 *                 example: SBIN0001234
 *               bankAccountHolderName:
 *                 type: string
 *                 example: Rajesh Kumar
 *     responses:
 *       201:
 *         description: Driver registered successfully, awaiting admin approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Driver registered successfully. Awaiting admin approval.
 *                 data:
 *                   type: object
 *                   properties:
 *                     driverId:
 *                       type: integer
 *                       example: 1
 *                     fullName:
 *                       type: string
 *                       example: Rajesh Kumar
 *                     email:
 *                       type: string
 *                       example: rajesh.driver@gmail.com
 *                     phone:
 *                       type: string
 *                       example: +919876543210
 *                     status:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: Validation error or duplicate driver
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Driver with same email, phone, license, Aadhar, or PAN already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/login:
 *   post:
 *     summary: Login for independent drivers
 *     description: Allows an approved independent driver to login and receive authentication tokens. Only drivers with 'approved' status can login.
 *     tags: [Independent Drivers]
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
 *                 example: rajesh.driver@gmail.com
 *               password:
 *                 type: string
 *                 example: Rajesh@123
 *     responses:
 *       200:
 *         description: Driver logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Driver logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       type: object
 *                       properties:
 *                         driverId:
 *                           type: integer
 *                           example: 1
 *                         fullName:
 *                           type: string
 *                           example: Rajesh Kumar
 *                         email:
 *                           type: string
 *                           example: rajesh.driver@gmail.com
 *                         phone:
 *                           type: string
 *                           example: +919876543210
 *                         rating:
 *                           type: number
 *                           format: decimal
 *                           example: 4.5
 *                         totalRides:
 *                           type: integer
 *                           example: 0
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials or driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Incorrect password
 *       403:
 *         description: Driver account not approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: Your account is pending. Please contact support.
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     IndependentDriver:
 *       type: object
 *       properties:
 *         driverId:
 *           type: integer
 *           example: 1
 *         fullName:
 *           type: string
 *           example: Rajesh Kumar
 *         email:
 *           type: string
 *           example: rajesh.driver@gmail.com
 *         phone:
 *           type: string
 *           example: +919876543210
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 1990-05-15
 *         gender:
 *           type: string
 *           enum: [male, female, others]
 *           example: male
 *         address:
 *           type: string
 *           example: 123, MG Road, Sector 15
 *         city:
 *           type: string
 *           example: Mumbai
 *         state:
 *           type: string
 *           example: Maharashtra
 *         pincode:
 *           type: string
 *           example: 400001
 *         licenseNumber:
 *           type: string
 *           example: MH0120230012345
 *         licenseExpiry:
 *           type: string
 *           format: date
 *           example: 2028-12-31
 *         licenseType:
 *           type: string
 *           enum: [two_wheeler, four_wheeler, commercial]
 *           example: commercial
 *         aadharNumber:
 *           type: string
 *           example: 123456789012
 *         panNumber:
 *           type: string
 *           example: ABCDE1234F
 *         bankAccountNumber:
 *           type: string
 *           example: 1234567890123456
 *         bankIfscCode:
 *           type: string
 *           example: SBIN0001234
 *         bankAccountHolderName:
 *           type: string
 *           example: Rajesh Kumar
 *         profilePhoto:
 *           type: string
 *           nullable: true
 *           example: https://example.com/photos/driver1.jpg
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *           example: approved
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         isOnline:
 *           type: boolean
 *           example: false
 *         isAvailable:
 *           type: boolean
 *           example: false
 *         currentLatitude:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 19.0760
 *         currentLongitude:
 *           type: number
 *           format: decimal
 *           nullable: true
 *           example: 72.8777
 *         lastLocationUpdate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2025-02-17T10:30:00.000Z
 *         rating:
 *           type: number
 *           format: decimal
 *           example: 4.5
 *         totalRides:
 *           type: integer
 *           example: 150
 *         totalEarnings:
 *           type: number
 *           format: decimal
 *           example: 45000.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-01-15T08:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-02-17T10:30:00.000Z
 */
