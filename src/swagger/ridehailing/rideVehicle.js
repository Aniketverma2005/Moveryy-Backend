/**
 * @swagger
 * tags:
 *   - name: Ride Vehicles
 *     description: Vehicle registration and management for independent drivers
 *
 * /api/v1/drivers/vehicle/add:
 *   post:
 *     summary: Register a new vehicle
 *     description: Allows an independent driver to register their vehicle. Each driver can have only one active vehicle.
 *     tags: [Ride Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleType
 *               - vehicleNumber
 *               - vehicleModel
 *               - vehicleBrand
 *               - vehicleColor
 *               - manufacturingYear
 *               - rcNumber
 *               - insuranceNumber
 *               - insuranceExpiryDate
 *               - seatingCapacity
 *               - fuelType
 *             properties:
 *               vehicleType:
 *                 type: string
 *                 enum: [bike, auto, cab_mini, cab_sedan, cab_suv]
 *                 example: auto
 *               vehicleNumber:
 *                 type: string
 *                 example: MH01AB1234
 *               vehicleModel:
 *                 type: string
 *                 example: Bajaj RE Compact
 *               vehicleBrand:
 *                 type: string
 *                 example: Bajaj
 *               vehicleColor:
 *                 type: string
 *                 example: Yellow
 *               manufacturingYear:
 *                 type: integer
 *                 minimum: 1990
 *                 example: 2020
 *               rcNumber:
 *                 type: string
 *                 example: MH01AB123456789
 *               rcExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2035-12-31
 *               insuranceNumber:
 *                 type: string
 *                 example: POL123456789
 *               insuranceProvider:
 *                 type: string
 *                 example: ICICI Lombard
 *               insuranceExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               fitnessExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-12-31
 *               permitNumber:
 *                 type: string
 *                 example: PER123456
 *               permitExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               seatingCapacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               fuelType:
 *                 type: string
 *                 enum: [petrol, diesel, cng, electric]
 *                 example: cng
 *     responses:
 *       201:
 *         description: Vehicle registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Vehicle registered successfully. Awaiting verification.
 *                 data:
 *                   type: object
 *                   properties:
 *                     vehicleId:
 *                       type: integer
 *                       example: 1
 *                     driverId:
 *                       type: integer
 *                       example: 1
 *                     vehicleType:
 *                       type: string
 *                       example: auto
 *                     vehicleNumber:
 *                       type: string
 *                       example: MH01AB1234
 *                     vehicleModel:
 *                       type: string
 *                       example: Bajaj RE Compact
 *                     verificationStatus:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: Validation error or duplicate vehicle
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/vehicle:
 *   get:
 *     summary: Get driver's registered vehicle
 *     description: Retrieves the vehicle details registered by the authenticated driver
 *     tags: [Ride Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Vehicle fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/RideVehicle'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: No vehicle found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/vehicle/{vehicleId}:
 *   patch:
 *     summary: Update vehicle details
 *     description: Allows driver to update specific vehicle details like insurance, color, etc.
 *     tags: [Ride Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleColor:
 *                 type: string
 *                 example: Black
 *               insuranceNumber:
 *                 type: string
 *                 example: POL987654321
 *               insuranceProvider:
 *                 type: string
 *                 example: HDFC ERGO
 *               insuranceExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-12-31
 *               fitnessExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2028-12-31
 *               permitNumber:
 *                 type: string
 *                 example: PER654321
 *               permitExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-12-31
 *               rcExpiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2036-12-31
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Vehicle updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/RideVehicle'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/vehicle/{vehicleId}:
 *   delete:
 *     summary: Delete vehicle
 *     description: Soft deletes the driver's vehicle. The vehicle will be marked as inactive.
 *     tags: [Ride Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         description: ID of the vehicle to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Vehicle deleted successfully
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Vehicle not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/drivers/vehicle/status/check:
 *   get:
 *     summary: Check vehicle status
 *     description: Checks if the driver has a vehicle registered and if they can go online
 *     tags: [Ride Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicle status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Vehicle status checked
 *                 data:
 *                   type: object
 *                   properties:
 *                     hasVehicle:
 *                       type: boolean
 *                       example: true
 *                     canGoOnline:
 *                       type: boolean
 *                       example: true
 *                     vehicleStatus:
 *                       type: object
 *                       properties:
 *                         verificationStatus:
 *                           type: string
 *                           enum: [pending, approved, rejected]
 *                           example: approved
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         insuranceExpired:
 *                           type: boolean
 *                           example: false
 *                         insuranceExpiryDate:
 *                           type: string
 *                           format: date
 *                           example: 2026-12-31
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RideVehicle:
 *       type: object
 *       properties:
 *         vehicleId:
 *           type: integer
 *           example: 1
 *         driverId:
 *           type: integer
 *           example: 1
 *         vehicleType:
 *           type: string
 *           enum: [bike, auto, cab_mini, cab_sedan, cab_suv]
 *           example: auto
 *         vehicleNumber:
 *           type: string
 *           example: MH01AB1234
 *         vehicleModel:
 *           type: string
 *           example: Bajaj RE Compact
 *         vehicleBrand:
 *           type: string
 *           example: Bajaj
 *         vehicleColor:
 *           type: string
 *           example: Yellow
 *         manufacturingYear:
 *           type: integer
 *           example: 2020
 *         rcNumber:
 *           type: string
 *           example: MH01AB123456789
 *         rcExpiryDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2035-12-31
 *         rcPhoto:
 *           type: string
 *           nullable: true
 *           example: https://example.com/rc/photo.jpg
 *         insuranceNumber:
 *           type: string
 *           example: POL123456789
 *         insuranceProvider:
 *           type: string
 *           nullable: true
 *           example: ICICI Lombard
 *         insuranceExpiryDate:
 *           type: string
 *           format: date
 *           example: 2026-12-31
 *         insurancePhoto:
 *           type: string
 *           nullable: true
 *           example: https://example.com/insurance/photo.jpg
 *         fitnessExpiryDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2027-12-31
 *         fitnessPhoto:
 *           type: string
 *           nullable: true
 *           example: https://example.com/fitness/photo.jpg
 *         permitNumber:
 *           type: string
 *           nullable: true
 *           example: PER123456
 *         permitExpiryDate:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: 2026-12-31
 *         permitPhoto:
 *           type: string
 *           nullable: true
 *           example: https://example.com/permit/photo.jpg
 *         seatingCapacity:
 *           type: integer
 *           example: 3
 *         fuelType:
 *           type: string
 *           enum: [petrol, diesel, cng, electric]
 *           example: cng
 *         vehiclePhotoFront:
 *           type: string
 *           nullable: true
 *           example: https://example.com/vehicle/front.jpg
 *         vehiclePhotoBack:
 *           type: string
 *           nullable: true
 *           example: https://example.com/vehicle/back.jpg
 *         vehiclePhotoSide:
 *           type: string
 *           nullable: true
 *           example: https://example.com/vehicle/side.jpg
 *         isVerified:
 *           type: boolean
 *           example: false
 *         verificationStatus:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *         rejectionReason:
 *           type: string
 *           nullable: true
 *           example: null
 *         isActive:
 *           type: boolean
 *           example: true
 *         isAvailable:
 *           type: boolean
 *           example: true
 */
