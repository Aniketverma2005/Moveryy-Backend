/**
 * @swagger
 * tags:
 *   name: Contact Us
 *   description: User complaint and support submission
 */

/**
 * @swagger
 * /api/v1/users/contactUs:
 *   post:
 *     summary: Submit a complaint or support request
 *     description: |
 *       Allows a logged-in user to submit a complaint or service feedback.
 *       
 *       - **Email** is automatically fetched from the authenticated user's token — no need to pass it in the body.
 *       - The complaint is saved to the database with status `pending`.
 *       - An email notification is sent to the Moveryy support team at moveryyy@gmail.com.
 *       - Mobile number must be in international format e.g. `+919876543210`.
 *     tags:
 *       - Contact Us
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - mobile
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Aniket Verma
 *               mobile:
 *                 type: string
 *                 example: "+919876543210"
 *               description:
 *                 type: string
 *                 example: My booking was cancelled without any notification. Please look into this.
 *     responses:
 *       201:
 *         description: Complaint submitted successfully
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
 *                   example: Your complaint has been submitted successfully. Our team will get back to you shortly.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Aniket Verma
 *                     email:
 *                       type: string
 *                       example: aniket@moveryy.com
 *                     mobile:
 *                       type: string
 *                       example: "+919876543210"
 *                     status:
 *                       type: string
 *                       enum: [pending, resolved, closed]
 *                       example: pending
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-08-17T10:30:00.000Z"
 *       400:
 *         description: Validation error (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: A valid mobile number is required (e.g. +919876543210)
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
