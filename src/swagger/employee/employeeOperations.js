/**
 * @swagger
 * tags:
 *   - name: Employee
 *     description: Employee Operations (employees only)
 */

/**
 * @swagger
 * /api/v1/employee/login:
 *   post:
 *     tags:
 *       - Employee
 *     summary: Employee login
 *     description: Allows an active employee to log in and receive access & refresh tokens.
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
 *                 example: "joeroot@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "JoeRoot@123"
 *     responses:
 *       200:
 *         description: Employee logged in successfully
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
 *                 data:
 *                   type: string
 *                   example: "Employee logged in Successfully"
 *                 message:
 *                   type: object
 *                   properties:
 *                     employee:
 *                       type: object
 *                       properties:
 *                         employeeId:
 *                           type: integer
 *                           example: 4
 *                         organizationId:
 *                           type: integer
 *                           example: 10
 *                         employeeName:
 *                           type: string
 *                           example: "Joe Root"
 *                         email:
 *                           type: string
 *                           example: "joeroot@gmail.com"
 *                         phone:
 *                           type: string
 *                           example: "+918773523452"
 *                         role:
 *                           type: string
 *                           example: "transport"
 *                         gender:
 *                           type: string
 *                           example: "male"
 *                         aadharNumber:
 *                           type: string
 *                           example: "123456789332"
 *                         panNumber:
 *                           type: string
 *                           example: "AF45DS2"
 *                         address:
 *                           type: string
 *                           example: "New Delhi, near Jama Masjid"
 *                         status:
 *                           type: string
 *                           example: "available"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         isBlacklisted:
 *                           type: boolean
 *                           example: false
 *                         blacklistReason:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         createdBy:
 *                           type: integer
 *                           example: 1
 *                         updatedBy:
 *                           type: integer
 *                           example: 1
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-05T15:30:50.000Z"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-06T07:25:35.000Z"
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials / Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Incorrect password"
 */


/**
 * @swagger
 * /api/v1/employee/logout:
 *   post:
 *     tags:
 *       - Employee
 *     summary: Employee logout
 *     description: Logs out the currently logged-in employee and clears the access & refresh tokens.
 *     responses:
 *       200:
 *         description: Employee logged out successfully
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
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "Employee logged out successfully"
 *       403:
 *         description: Unauthorized action (only employees can log out)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Only employees can log out here"
 */


/**
 * @swagger
 * /api/v1/employee/status:
 *   post:
 *     tags:
 *       - Employee
 *     summary: Change employee status to availabe or busy
 *     description: Allows a logged-in employee to change their status to "available" or "busy".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, busy]
 *                 example: busy
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Status updated to 'busy' successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: integer
 *                       example: 4
 *                     status:
 *                       type: string
 *                       example: busy
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid status value"
 *       403:
 *         description: Unauthorized action (only employees can change status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: "Only employees can change their status"
 */
