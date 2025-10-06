/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and authentication
 *
 * /api/v1/users/signup:
 *   post:
 *     summary: Create a new owner account
 *     description: |
 *       Registers a new owner user with email, password, and basic details.
 *
 *       Validation rules:
 *       - **firstName / lastName** → required
 *       - **email** → valid format
 *       - **password** → min 8 chars
 *       - **phone** → international format (+[country][number], 7–15 digits)
 *       - **role** → must be one of: `admin`, `user`, `transport`
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *               phone:
 *                 type: string
 *                 example: +14155552671
 *               role:
 *                 type: string
 *                 enum: [admin, user, transport]
 *                 example: admin
 *     responses:
 *       200:
 *         description: User created successfully
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
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     firstName:
 *                       type: string
 *                       example: john
 *                     lastName:
 *                       type: string
 *                       example: doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: +919887263524
 *                     role:
 *                       type: string
 *                       example: admin
 *                     refreshToken:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-03T18:25:26.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-03T18:25:26.000Z"
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/v1/users/user:
 *   get:
 *     summary: Fetch the currently logged-in user
 *     description: Retrieves details of the logged-in user based on JWT token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully
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
 *                   example: User fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: aniket
 *                     lastName:
 *                       type: string
 *                       example: verma
 *                     email:
 *                       type: string
 *                       example: aniket@moveryy.com
 *                     phone:
 *                       type: string
 *                       example: +918776352434
 *                     role:
 *                       type: string
 *                       example: admin
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-09-27T11:49:45.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-05T13:08:04.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/users/updatePassword:
 *   patch:
 *     summary: Update user password
 *     description: Allows a logged-in user to change their password by providing the old password and a new password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: Aniket@2005
 *                 description: The current password of the user
 *               newPassword:
 *                 type: string
 *                 example: Aniket@123
 *                 description: The new password to set (must meet your password rules)
 *     responses:
 *       200:
 *         description: Password changed successfully
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
 *                   example: Password changed successfully
 *                 data:
 *                   type: object
 *                   description: Empty object
 *                   example: {}
 *       400:
 *         description: Validation error (e.g., missing oldPassword or newPassword)
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Old password incorrect
 *       500:
 *         description: Internal server error
 */
