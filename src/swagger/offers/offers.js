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

/**
 * @swagger
 * /api/v1/offers/all:
 *   get:
 *     tags: [Offers]
 *     summary: Fetch all offers for the logged-in organization
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offers fetched Successfully
 *                 offers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       offerId:
 *                         type: integer
 *                         example: 3
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       offerName:
 *                         type: string
 *                         example: New Special Discount
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-01T00:00:00.000Z"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-31T00:00:00.000Z"
 *                       discountValue:
 *                         type: string
 *                         example: "15.00"
 *                       discountType:
 *                         type: string
 *                         example: percentage
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdBy:
 *                         type: integer
 *                         example: 1
 *                       updatedBy:
 *                         type: integer
 *                         example: 1
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-05T12:16:10.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-05T12:49:43.000Z"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Access forbidden
 */


/**
 * @swagger
 * /api/v1/offers/{offerId}:
 *   patch:
 *     tags: [Offers]
 *     summary: Update an existing offer (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the offer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offerName:
 *                 type: string
 *                 example: New Special Discount
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-10"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-10-31"
 *               discountValue:
 *                 type: string
 *                 example: "15.00"
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offer updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     offerId:
 *                       type: integer
 *                       example: 3
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     offerName:
 *                       type: string
 *                       example: New Special Discount
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
 *                       example: percentage
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
 *                       example: "2025-10-05T12:16:10.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T08:21:21.538Z"
 *       400:
 *         description: Validation errors (missing fields, invalid values)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin users can update offers
 *       404:
 *         description: Offer not found
 *
 *     description: |
 *       ### Validation Notes:
 *       - **offerName**: required, min 3 characters
 *       - **startDate**: required, valid date, cannot be after endDate
 *       - **endDate**: required, valid date, cannot be before startDate
 *       - **discountValue**: required, numeric string
 *       - **discountType**: required, one of [percentage, fixed]
 *       - **isActive**: required, boolean
 */



/**
 * @swagger
 * /api/v1/offers/{offerId}:
 *   delete:
 *     tags: [Offers]
 *     summary: Delete an existing offer (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the offer to delete
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Offers deleted Successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin users can delete offers
 *       404:
 *         description: Offer not found
 */

