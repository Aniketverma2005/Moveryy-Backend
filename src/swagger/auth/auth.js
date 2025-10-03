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
 *     description: Logs in a user with their email and password.
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
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User logged in Successfully
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
 *                           example: "2025-10-03T16:47:28.000Z"
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
