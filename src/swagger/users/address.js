/**
 * @swagger
 * tags:
 *   - name: Addresses
 *     description: Manage user addresses (User Only)
 */

/**
 * @swagger
 * /api/v1/address:
 *   post:
 *     summary: Add a new address for the logged-in user
 *     description: |
 *       Adds a new address for a user. Only users with role `"user"` can add addresses.
 *       
 *       ### Validation Rules:
 *       - `addressType` → required, `"Home"` or `"Office"`
 *       - `addressName` → required
 *       - `address` → required
 *       - `city` → required
 *       - `state` → required
 *       - `pincode` → required, 6-digit numeric string
 *       - `isDefault` → optional, boolean
 *       
 *       **Access Control:**
 *       - User must be authenticated (JWT required)
 *       - User role must be `"user"`
 *
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressType
 *               - addressName
 *               - address
 *               - city
 *               - state
 *               - pincode
 *             properties:
 *               addressType:
 *                 type: string
 *                 enum: [Home, Office]
 *                 example: Home
 *               addressName:
 *                 type: string
 *                 example: My Apartment
 *               address:
 *                 type: string
 *                 example: 123, MG Road, Sector 14
 *               city:
 *                 type: string
 *                 example: Bangalore
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               pincode:
 *                 type: string
 *                 example: 560001
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Address added successfully
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
 *                   example: Address added successfully
 *                 address:
 *                   type: object
 *                   properties:
 *                     addressId:
 *                       type: integer
 *                       example: 1
 *                     addressType:
 *                       type: string
 *                       example: Home
 *                     addressName:
 *                       type: string
 *                       example: My Apartment
 *                     address:
 *                       type: string
 *                       example: 123, MG Road, Sector 14
 *                     city:
 *                       type: string
 *                       example: Bangalore
 *                     state:
 *                       type: string
 *                       example: Karnataka
 *                     pincode:
 *                       type: string
 *                       example: 123456
 *                     isDefault:
 *                       type: boolean
 *                       example: false
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdBy:
 *                       type: integer
 *                       example: 2
 *                     updatedBy:
 *                       type: integer
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T05:23:15.064Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T05:23:15.064Z
 *       402:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only users with role "user" can add addresses
 */


/**
 * @swagger
 * /api/v1/address:
 *   get:
 *     summary: Fetch all addresses for the logged-in user
 *     description: |
 *       Retrieves all addresses created by the authenticated user.  
 *       Only users with role `"user"` can fetch addresses.
 *       
 *       **Access Control:**
 *       - User must be authenticated (JWT required)
 *       - User role must be `"user"`
 *       
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
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
 *                   example: Addresses fetched successfully
 *                 addresses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       addressId:
 *                         type: integer
 *                         example: 1
 *                       addressType:
 *                         type: string
 *                         example: Home
 *                       addressName:
 *                         type: string
 *                         example: My Apartment
 *                       address:
 *                         type: string
 *                         example: 123, MG Road, Sector 14
 *                       city:
 *                         type: string
 *                         example: Bangalore
 *                       state:
 *                         type: string
 *                         example: Karnataka
 *                       pincode:
 *                         type: string
 *                         example: 123456
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       isDefault:
 *                         type: boolean
 *                         example: false
 *                       createdBy:
 *                         type: integer
 *                         example: 2
 *                       updatedBy:
 *                         type: integer
 *                         example: 2
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-15T05:23:15.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-15T05:23:15.000Z
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only users with role "user" can fetch addresses
 */

/**
 * @swagger
 * /api/v1/address/{addressId}:
 *   get:
 *     summary: Fetch a single address by ID
 *     description: |
 *       Retrieves a specific address created by the authenticated user.  
 *       Only users with role `"user"` can fetch an address.
 *       
 *       **Access Control:**
 *       - User must be authenticated (JWT required)
 *       - User role must be `"user"`
 *
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to fetch
 *     responses:
 *       200:
 *         description: Address fetched successfully
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
 *                   example: Address fetched successfully
 *                 address:
 *                   type: object
 *                   properties:
 *                     addressId:
 *                       type: integer
 *                       example: 1
 *                     addressType:
 *                       type: string
 *                       example: Home
 *                     addressName:
 *                       type: string
 *                       example: My Apartment
 *                     address:
 *                       type: string
 *                       example: 123, MG Road, Sector 14
 *                     city:
 *                       type: string
 *                       example: Bangalore
 *                     state:
 *                       type: string
 *                       example: Karnataka
 *                     pincode:
 *                       type: string
 *                       example: 123456
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isDefault:
 *                       type: boolean
 *                       example: false
 *                     createdBy:
 *                       type: integer
 *                       example: 2
 *                     updatedBy:
 *                       type: integer
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T05:23:15.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T05:23:15.000Z
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only users with role "user" can fetch the address
 *       404:
 *         description: Address not found
 */


/**
 * @swagger
 * /api/v1/address/{addressId}:
 *   patch:
 *     summary: Update an existing address by ID
 *     description: |
 *       Updates a specific address created by the authenticated user.  
 *       Only users with role `"user"` can update an address.
 *       
 *       **Access Control:**
 *       - User must be authenticated (JWT required)
 *       - User role must be `"user"`
 *
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addressType:
 *                 type: string
 *                 enum: [Home, Office]
 *                 example: Office
 *               addressName:
 *                 type: string
 *                 example: My Apartment
 *               address:
 *                 type: string
 *                 example: 123, MG Road, Sector 14
 *               city:
 *                 type: string
 *                 example: Bangalore
 *               state:
 *                 type: string
 *                 example: Karnataka
 *               pincode:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Address updated successfully
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
 *                   example: Address updated successfully
 *                 address:
 *                   type: object
 *                   properties:
 *                     addressId:
 *                       type: integer
 *                       example: 1
 *                     addressType:
 *                       type: string
 *                       example: Office
 *                     addressName:
 *                       type: string
 *                       example: My Apartment
 *                     address:
 *                       type: string
 *                       example: 123, MG Road, Sector 14
 *                     city:
 *                       type: string
 *                       example: Bangalore
 *                     state:
 *                       type: string
 *                       example: Karnataka
 *                     pincode:
 *                       type: string
 *                       example: 123456
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isDefault:
 *                       type: boolean
 *                       example: false
 *                     createdBy:
 *                       type: integer
 *                       example: 2
 *                     updatedBy:
 *                       type: integer
 *                       example: 2
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T05:23:15.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-15T06:21:03.185Z
 *       400:
 *         description: Validation errors (missing or invalid input fields)
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only users with role "user" can update the address
 *       404:
 *         description: Address not found
 */


/**
 * @swagger
 * /api/v1/address/{addressId}:
 *   delete:
 *     summary: Delete an address by ID
 *     description: Deletes a specific address created by the authenticated user.  
 *       Only users with role `"user"` can delete an address.
 *
 *     tags:
 *       - Addresses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the address to delete
 *     responses:
 *       200:
 *         description: Address deleted successfully
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
 *                   example: Address deleted successfully
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Only users with role "user" can delete the address
 *       404:
 *         description: Address not found
 */



