/**
 * @swagger
 * tags:
 *   - name: Offers
 *     description: Offers Management (admin only)
 */

/**
 * @swagger
 * /api/v1/offers/create:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offers]
 *     description: Allows an admin to create a new offer for an organization.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offerName:
 *                 type: string
 *                 example: Diwali Special Discount
 *               discountType:
 *                 type: string
 *                 enum: [percentage, flat]
 *                 example: percentage
 *               discountValue:
 *                 type: number
 *                 example: 10
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-01
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: 2025-10-31
 *               description:
 *                 type: string
 *                 example: Flat 10% off on all vehicle shifting services during Diwali.
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offer created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     offerId:
 *                       type: integer
 *                       example: 1
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     offerName:
 *                       type: string
 *                       example: Diwali Special Discount
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-01T00:00:00.000Z
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-31T00:00:00.000Z
 *                     discountValue:
 *                       type: number
 *                       example: 10
 *                     discountType:
 *                       type: string
 *                       example: percentage
 *       400:
 *         description: Bad Request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       500:
 *         description: Internal Server Error
 */
