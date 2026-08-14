/**
 * @swagger
 * tags:
 *   - name: Independent Drivers
 *     description: Independent driver authentication for ride-hailing services
 */

/**
 * @swagger
 * /api/v1/drivers/send-otp:
 *   post:
 *     summary: Send OTP to driver email (Register if new, Login if existing)
 *     description: |
 *       Sends a one-time password (OTP) to the driver's email.
 *       - If the email is **not registered**, a new driver account is created and OTP is sent.
 *       - If the email is **already registered**, OTP is sent to login.
 *     tags:
 *       - Independent Drivers
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
 *                 example: rajesh.driver@gmail.com
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
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: rajesh.driver@gmail.com
 *                     isNewDriver:
 *                       type: boolean
 *                       description: true if this is a new registration, false if existing driver login
 *                       example: true
 *                     message:
 *                       type: string
 *                       example: OTP sent! Please verify to complete registration. This OTP is valid for 5 minutes only.
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/verify-otp:
 *   post:
 *     summary: Verify OTP and get access tokens
 *     description: |
 *       Verifies the OTP sent to the driver's email.
 *       - On success, returns **accessToken** and **refreshToken**.
 *       - Returns `nextStep: "complete_profile"` if driver profile is incomplete.
 *       - Returns `nextStep: "dashboard"` if driver profile is already complete.
 *     tags:
 *       - Independent Drivers
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
 *                 example: rajesh.driver@gmail.com
 *               otp:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully
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
 *                   example: OTP verified successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     driver:
 *                       type: object
 *                       properties:
 *                         driverId:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           example: rajesh.driver@gmail.com
 *                         fullName:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         status:
 *                           type: string
 *                           example: pending
 *                         isProfileComplete:
 *                           type: boolean
 *                           example: false
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     nextStep:
 *                       type: string
 *                       enum: [complete_profile, dashboard]
 *                       description: Tells the frontend where to redirect the driver
 *                       example: complete_profile
 *       400:
 *         description: Invalid or expired OTP
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
 *                   example: OTP has expired. Please request a new OTP.
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Internal server error
 */
