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


/**
 * @swagger
 * /api/v1/vehiclesoffer/vehicles:
 *   get:
 *     summary: Fetch all Vehicles with their Active Offers
 *     description: Retrieves all vehicles in the admin's organization along with their associated offer (if any).
 *     tags:
 *       - Vehicle Offers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles with their offers fetched successfully
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
 *                   example: "Vehicles with their offers fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleId:
 *                         type: integer
 *                         example: 2
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       vehicleName:
 *                         type: string
 *                         example: "Tata Ace"
 *                       registrationNumber:
 *                         type: string
 *                         example: "DL1AB1234"
 *                       manufacturer:
 *                         type: string
 *                         example: "Tata Motors"
 *                       vehicleType:
 *                         type: string
 *                         example: "truck"
 *                       capacityValue:
 *                         type: string
 *                         example: "2"
 *                       capacityUnit:
 *                         type: string
 *                         example: "tons"
 *                       registrarName:
 *                         type: string
 *                         example: "Ravi Kumar"
 *                       chassisNumber:
 *                         type: string
 *                         example: "MA3T1234567890123"
 *                       serviceType:
 *                         type: string
 *                         example: "vehicletransport"
 *                       status:
 *                         type: string
 *                         example: "available"
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
 *                         example: "2025-10-06T12:22:51.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-06T12:22:51.000Z"
 *                       offer:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           vehicleOfferId:
 *                             type: integer
 *                             example: 1
 *                           offerName:
 *                             type: string
 *                             example: "Diwali Transport Discount"
 *                           startDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-10T00:00:00.000Z"
 *                           endDate:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-10-31T00:00:00.000Z"
 *                           discountValue:
 *                             type: string
 *                             example: "15.00"
 *                           discountType:
 *                             type: string
 *                             example: "percentage"
 *                           isActive:
 *                             type: boolean
 *                             example: true
 */


/**
 * @swagger
 * /api/v1/vehiclesOffer/all:
 *   get:
 *     summary: Fetch all Active Offers
 *     description: Returns all vehicle offers for the admin's organization, including vehicle details.
 *     tags:
 *       - Vehicle Offers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Offers fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offers fetched Successfully"
 *                 offers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleOfferId:
 *                         type: integer
 *                         example: 1
 *                       vehicleId:
 *                         type: integer
 *                         example: 2
 *                       offerName:
 *                         type: string
 *                         example: "Diwali Transport Discount"
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-10T00:00:00.000Z"
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-31T00:00:00.000Z"
 *                       discountValue:
 *                         type: string
 *                         example: "15.00"
 *                       discountType:
 *                         type: string
 *                         example: "percentage"
 *                       vehicle:
 *                         type: object
 *                         properties:
 *                           vehicleName:
 *                             type: string
 *                             example: "Tata Ace"
 *                           registrationNumber:
 *                             type: string
 *                             example: "DL1AB1234"
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Admin must belong to an organization
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/vehiclesOffer/{vehicleOfferId}:
 *   delete:
 *     summary: Delete a vehicle offer
 *     description: Deletes a vehicle offer by its ID. Only accessible by admin users belonging to the organization.
 *     tags:
 *       - Vehicle Offers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleOfferId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *         description: ID of the vehicle offer to delete
 *     responses:
 *       200:
 *         description: Vehicle offer deleted successfully
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
 *                   example: "Vehicle offer deleted successfully"
 *       400:
 *         description: Unauthorized access or user does not belong to any organization
 *       401:
 *         description: Unauthorized (invalid or missing token)
 *       403:
 *         description: Only admin users can delete vehicle offers
 *       404:
 *         description: Vehicle offer not found
 *       500:
 *         description: Internal server error
 */
