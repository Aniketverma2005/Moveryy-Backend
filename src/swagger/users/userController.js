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
