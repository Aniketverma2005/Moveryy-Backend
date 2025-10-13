/**
 * @swagger
 * tags:
 *   - name: Pricing Plans
 *     description: Manage Pricing Plans of the Active Vehicles of Organization
 */

/**
 * @swagger
 * /api/v1/pricingPlan/create:
 *   post:
 *     summary: Create a new Pricing Plan
 *     description: |
 *       Allows an **admin user** to create a new pricing plan for services within their organization.  
 *       
 *       ### Validation Notes:
 *       - **serviceType**: required, non-empty string (e.g., "vehicletransport", "houseshift", "officeshift")
 *       - **vehicleType**: required, non-empty string (e.g., "truck", "van")
 *       - **minCapacity**: required, numeric, ≥ 0
 *       - **maxCapacity**: required, numeric, must be **greater than** minCapacity
 *       - **capacityUnit**: required, string, **depends on serviceType**:
 *           - `vehicletransport` → must be `"tons"`
 *           - `houseshift` → must be `"bhk"`
 *           - `officeshift` → must be `"cubic_meters"`
 *       - **baseRate**: required, numeric, > 0
 *       - **pricePerKm**: required, numeric, > 0
 *       - **surgeCharges**: optional, numeric (fractional multiplier, e.g., 0.05 for 5%)
 *
 *       **Access Control:**
 *       - Only users with the role **admin** can create pricing plans.
 *       - The user must belong to a valid organization (`organizationId` must exist in user record).
 *       
 *       **Uniqueness:**
 *       - A pricing plan must be unique for the combination of  
 *         `(organizationId, serviceType, vehicleType, minCapacity, maxCapacity, capacityUnit)`.
 *       
 *       **Error Codes:**
 *       - 400 – Unauthorized or invalid access
 *       - 401 – Invalid capacityUnit for given serviceType
 *       - 402 – Validation errors (missing/invalid inputs)
 *       - 403 – Duplicate pricing plan already exists
 *       
 *     tags:
 *       - Pricing Plans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 example: vehicletransport
 *               vehicleType:
 *                 type: string
 *                 example: truck
 *               minCapacity:
 *                 type: number
 *                 example: 1.5
 *               maxCapacity:
 *                 type: number
 *                 example: 3.0
 *               capacityUnit:
 *                 type: string
 *                 example: tons
 *                 description: |
 *                   Required unit based on serviceType:  
 *                   - `"vehicletransport"` → `"tons"`  
 *                   - `"houseshift"` → `"bhk"`  
 *                   - `"officeshift"` → `"cubic_meters"`
 *               baseRate:
 *                 type: number
 *                 example: 500
 *               pricePerKm:
 *                 type: number
 *                 example: 18
 *               surgeCharges:
 *                 type: number
 *                 example: 0.05
 *     responses:
 *       201:
 *         description: Pricing plan created successfully
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
 *                   example: Pricing plan created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     pricingPlanId:
 *                       type: integer
 *                       example: 1
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     serviceType:
 *                       type: string
 *                       example: vehicletransport
 *                     vehicleType:
 *                       type: string
 *                       example: truck
 *                     minCapacity:
 *                       type: number
 *                       example: 1.5
 *                     maxCapacity:
 *                       type: number
 *                       example: 3.0
 *                     capacityUnit:
 *                       type: string
 *                       example: tons
 *                     baseRate:
 *                       type: number
 *                       example: 500
 *                     pricePerKm:
 *                       type: number
 *                       example: 18
 *                     surgeCharges:
 *                       type: number
 *                       example: 0.05
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     updatedBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-10T15:57:43.552Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-10T15:57:43.552Z
 *       400:
 *         description: Unauthorized or invalid access
 *       401:
 *         description: Invalid capacityUnit for the given serviceType
 *       402:
 *         description: Validation errors (missing or invalid input fields)
 *       403:
 *         description: Pricing plan already exists
 */

/**
 * @swagger
 * /api/v1/pricingPlan/all:
 *   get:
 *     summary: Fetch all Pricing Plans
 *     description: |
 *       Retrieves all pricing plans for the organization of the authenticated user.  
 *       Only users belonging to an organization can fetch pricing plans.
 *       
 *       **Access Control:**
 *       - User must belong to a valid organization (`organizationId` must exist in user record).
 *
 *     tags:
 *       - Pricing Plans
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pricing Plans fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pricing Plans fetched Successfully
 *                 pricingPlan:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       pricingPlanId:
 *                         type: integer
 *                         example: 1
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       serviceType:
 *                         type: string
 *                         example: vehicletransport
 *                       vehicleType:
 *                         type: string
 *                         example: truck
 *                       minCapacity:
 *                         type: number
 *                         example: 1.5
 *                       maxCapacity:
 *                         type: number
 *                         example: 3
 *                       capacityUnit:
 *                         type: string
 *                         example: tons
 *                       baseRate:
 *                         type: number
 *                         example: 500
 *                       pricePerKm:
 *                         type: number
 *                         example: 18
 *                       surgeCharges:
 *                         type: number
 *                         example: 0.05
 *       400:
 *         description: Unauthorized or invalid access
 *       404:
 *         description: No pricing plans found
 */

/**
 * @swagger
 * /api/v1/pricingPlan/{pricingPlanId}:
 *   delete:
 *     summary: Delete a Pricing Plan
 *     description: Deletes a pricing plan by its ID.
 *     tags:
 *       - Pricing Plans
 *     parameters:
 *       - in: path
 *         name: pricingPlanId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the pricing plan to delete
 *     responses:
 *       200:
 *         description: Pricing Plan deleted successfully
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
 *                   example: "Pricing Plan deleted successfully"
 *                 data:
 *                   type: string
 *                   example: "1"
 *       404:
 *         description: Pricing Plan not found
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
 *                   example: "Pricing Plan not found"
 * 
 *       400:
 *         description: Unauthorized or invalid access
 *   
 */
