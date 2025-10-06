/**
 * @swagger
 * tags:
 *   name: Vehicle Offers
 *   description: Manage vehicle-specific offers
 */

/**
 * @swagger
 * /api/v1/vehiclesOffer/create:
 *   post:
 *     summary: Create a vehicle offer
 *     description: Allows an admin to create a vehicle-specific offer for their organization.
 *     tags:
 *       - Vehicle Offers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - offerName
 *               - startDate
 *               - endDate
 *               - discountValue
 *               - discountType
 *             properties:
 *               vehicleId:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the vehicle to apply the offer on
 *               offerName:
 *                 type: string
 *                 example: "Diwali Transport Discount"
 *                 description: Name of the offer
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-10"
 *                 description: Start date of the offer
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-31"
 *                 description: End date of the offer
 *               discountValue:
 *                 type: string
 *                 example: "15.00"
 *                 description: Discount value (percentage or fixed amount)
 *               discountType:
 *                 type: string
 *                 enum: [percentage, value]
 *                 example: "percentage"
 *                 description: Type of discount
 *     responses:
 *       201:
 *         description: Vehicle Offer created successfully
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
 *                   example: "Vehicle Offer created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicleOfferId:
 *                       type: integer
 *                       example: 1
 *                     vehicleId:
 *                       type: integer
 *                       example: 2
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     offerName:
 *                       type: string
 *                       example: "Diwali Transport Discount"
 *                     startDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-10T00:00:00.000Z"
 *                     endDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-31T00:00:00.000Z"
 *                     discountValue:
 *                       type: string
 *                       example: "15.00"
 *                     discountType:
 *                       type: string
 *                       example: "percentage"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     updatedBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T12:42:45.174Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T12:42:45.174Z"
 *       400:
 *         description: Invalid request (missing fields or invalid discount type)
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Vehicle does not belong to the admin's organization or admin role required
 *       409:
 *         description: Offer already exists for this vehicle
 *       500:
 *         description: Internal server error
 */
