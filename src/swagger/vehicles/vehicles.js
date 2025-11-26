/**
 * @swagger
 * tags:
 *   - name: Vehicles
 *     description: Vehicles Management
 */

/**
 * @swagger
 * /api/v1/vehicles/register:
 *   post:
 *     tags: [Vehicles]
 *     summary: Register a new vehicle (admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleName
 *               - registrationNumber
 *               - manufacturer
 *               - vehicleType
 *               - capacityValue
 *               - capacityUnit
 *               - serviceType
 *               - registrarName
 *               - chassisNumber
 *             properties:
 *               vehicleName:
 *                 type: string
 *                 example: Tata Ace
 *               registrationNumber:
 *                 type: string
 *                 example: DL1AB1234
 *               manufacturer:
 *                 type: string
 *                 example: Tata Motors
 *               vehicleType:
 *                 type: string
 *                 example: truck
 *               capacityValue:
 *                 type: number
 *                 example: 2
 *               capacityUnit:
 *                 type: string
 *                 enum: [bhk, tons, cubic_meters]
 *                 example: tons
 *               serviceType:
 *                 type: string
 *                 enum: [houseshift, vehicletransport, officeshift]
 *                 example: vehicletransport
 *               registrarName:
 *                 type: string
 *                 example: Ravi Kumar
 *               chassisNumber:
 *                 type: string
 *                 example: MA3T1234567890123
 *     responses:
 *       200:
 *         description: Vehicle registered Successfully
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
 *                   example: Vehicle registered Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: integer
 *                       example: 1
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     vehicleName:
 *                       type: string
 *                       example: Tata Ace
 *                     registrationNumber:
 *                       type: string
 *                       example: DL1AB1234
 *                     chassisNumber:
 *                       type: string
 *                       example: MA3T1234567890123
 *       400:
 *         description: Validation errors (missing/invalid fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin users can register vehicles
 *       409:
 *         description: Registration number or chassis number already exists
 *     description: |
 *       ### Validation Notes:
 *       - **vehicleName**: required, min 3 characters
 *       - **registrationNumber**: required, unique across all vehicles
 *       - **manufacturer**: required, min 3 characters
 *       - **vehicleType**: required, min 3 characters (e.g., truck, 6-wheeler)
 *       - **capacityValue**: required, numeric
 *       - **capacityUnit**: required, one of [bhk, tons, cubic_meters]
 *       - **serviceType**: required, one of [houseshift, vehicletransport, officeshift]
 *       - **registrarName**: required, min 3 characters
 *       - **chassisNumber**: required, unique across all vehicles
 */

/**
 * @swagger
 * /api/v1/vehicles/all:
 *   get:
 *     tags: [Vehicles]
 *     summary: Fetch all vehicles for the logged-in admin's organization
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicles fetched Successfully
 *                 vehicles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleId:
 *                         type: integer
 *                         example: 1
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       vehicleName:
 *                         type: string
 *                         example: Tata Ace
 *                       registrationNumber:
 *                         type: string
 *                         example: DL1AB1234
 *                       manufacturer:
 *                         type: string
 *                         example: Tata Motors
 *                       vehicleType:
 *                         type: string
 *                         example: truck
 *                       capacityValue:
 *                         type: number
 *                         example: 2
 *                       capacityUnit:
 *                         type: string
 *                         example: tons
 *                       registrarName:
 *                         type: string
 *                         example: Ravi Kumar
 *                       chassisNumber:
 *                         type: string
 *                         example: MA3T1234567890123
 *                       serviceType:
 *                         type: string
 *                         example: vehicletransport
 *                       status:
 *                         type: string
 *                         example: available
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
 *                         example: "2025-10-06T07:47:42.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-06T07:47:42.000Z"
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *       403:
 *         description: Only admin users can fetch all vehicles
 */


/**
 * @swagger
 * /api/v1/vehicles/{vehicleId}:
 *   patch:
 *     tags: [Vehicles]
 *     summary: Update vehicle details (admin only)
 *     description: |
 *       Update an existing vehicle. Only admin users can perform this action.
 *
 *       ### Validation Notes:
 *       - **vehicleName**: required, min 3 characters
 *       - **registrationNumber**: required, unique across all vehicles
 *       - **manufacturer**: required, min 3 characters
 *       - **vehicleType**: required, min 3 characters (e.g., truck, 6-wheeler)
 *       - **capacityValue**: required, numeric
 *       - **capacityUnit**: required, one of [bhk, tons, cubic_meters]
 *       - **serviceType**: required, one of [houseshift, vehicletransport, officeshift]
 *       - **registrarName**: required, min 3 characters
 *       - **chassisNumber**: required, unique across all vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleName:
 *                 type: string
 *                 example: Tata Ace
 *               registrationNumber:
 *                 type: string
 *                 example: DL1AB1354
 *               manufacturer:
 *                 type: string
 *                 example: Tata Motors
 *               vehicleType:
 *                 type: string
 *                 example: truck
 *               capacityValue:
 *                 type: number
 *                 example: 2
 *               capacityUnit:
 *                 type: string
 *                 enum: [bhk, tons, cubic_meters]
 *                 example: tons
 *               serviceType:
 *                 type: string
 *                 enum: [houseshift, vehicletransport, officeshift]
 *                 example: vehicletransport
 *               registrarName:
 *                 type: string
 *                 example: Ravi Kumar
 *               chassisNumber:
 *                 type: string
 *                 example: MA3T1234567890123
 *     responses:
 *       200:
 *         description: Vehicle details updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Details Updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: integer
 *                       example: 1
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     vehicleName:
 *                       type: string
 *                       example: Tata Ace
 *                     registrationNumber:
 *                       type: string
 *                       example: DL1AB1354
 *                     manufacturer:
 *                       type: string
 *                       example: Tata Motors
 *                     vehicleType:
 *                       type: string
 *                       example: truck
 *                     capacityValue:
 *                       type: number
 *                       example: 2
 *                     capacityUnit:
 *                       type: string
 *                       example: tons
 *                     registrarName:
 *                       type: string
 *                       example: Ravi Kumar
 *                     chassisNumber:
 *                       type: string
 *                       example: MA3T1234567890123
 *                     serviceType:
 *                       type: string
 *                       example: vehicletransport
 *                     status:
 *                       type: string
 *                       example: available
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
 *                       example: "2025-10-06T07:47:42.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T08:02:09.401Z"
 *       400:
 *         description: Validation errors (e.g., missing fields, invalid values)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin users can update vehicles
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Registration number or chassis number already exists
 */


/**
 * @swagger
 * /api/v1/vehicles/{vehicleId}:
 *   delete:
 *     tags: [Vehicles]
 *     summary: Delete a vehicle (admin only)
 *     description: Only admin users can delete a vehicle. Deletes the vehicle permanently.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
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
 *                   example: Vehicle deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: string
 *                       example: "1"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin users can delete vehicles
 *       404:
 *         description: Vehicle not found
 */


/**
 * @swagger
 * /api/v1/vehicles:
 *   get:
 *     tags: [Vehicles]
 *     summary: Count total vehicles in the organization (admin only)
 *     description: Returns the total number of vehicles in the logged-in admin's organization.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle count fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total vehicle fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     totalVehicles:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Only admin users can access this API
 */


/**
 * @swagger
 * /api/v1/vehicles/{vehicleId}/offers:
 *   get:
 *     tags: [Vehicles]
 *     summary: Fetch all offers for a specific vehicle (user only)
 *     description: Returns all active offers associated with the given vehicle ID. Includes vehicle-specific, organization-wide, and service-type offers.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Vehicle offers fetched successfully
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
 *                   example: Vehicle offers fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       vehicleOfferId:
 *                         type: integer
 *                         example: 3
 *                       vehicleId:
 *                         type: integer
 *                         example: 2
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       offerName:
 *                         type: string
 *                         example: Diwali Discount
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-10T00:00:00.000Z
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-31T00:00:00.000Z
 *                       discountValue:
 *                         type: string
 *                         example: "15.00"
 *                       discountType:
 *                         type: string
 *                         enum: [percentage, value]
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
 *                         example: 2025-10-08T14:29:53.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-08T14:29:53.000Z
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Only user role can access this API
 *       404:
 *         description: Vehicle not found
 */
