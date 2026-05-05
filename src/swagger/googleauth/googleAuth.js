/**
 * @swagger
 * /api/v1/users/google/signup:
 *   post:
 *     summary: Sign up with Google
 *     tags: [Google Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - googleToken
 *               - role
 *             properties:
 *               googleToken:
 *                 type: string
 *                 description: Google ID token from OAuth
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 description: User role selection
 *     responses:
 *       201:
 *         description: Google sign-up successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already registered
 */

