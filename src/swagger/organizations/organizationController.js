/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management (admin only)
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/v1/organizations/create:
 *   post:
 *     summary: Create a new Organization
 *     description: |
 *       Creates a new organization. Only **admin users** are allowed to perform this action.
 *
 *       ### Validation Notes:
 *       - **organizationName**: required, min 3 characters
 *       - **organizationType**: required, min 3 characters
 *       - **businessName**: required, min 3 characters
 *       - **about**: optional
 *       - **gstNumber**: optional, 15-character GST number
 *       - **website**: optional, website URL
 *       - **phone**: required, `+` optional, 7–15 digits
 *       - **email**: required, must be valid email, unique
 *       - **logo**: optional
 *       - **country**: required
 *       - **state**: required
 *       - **city**: required
 *       - **pincode**: required, numeric
 *       - **addressLine1**: required
 *       - **addressLine2**: optional
 *
 *       Uniqueness is enforced on `email` and `phone`.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - organizationName
 *               - organizationType
 *               - businessName
 *               - phone
 *               - email
 *               - country
 *               - state
 *               - city
 *               - pincode
 *               - addressLine1
 *             properties:
 *               organizationName:
 *                 type: string
 *                 example: Aggarwal Packers & transports
 *               organizationType:
 *                 type: string
 *                 example: Home Shift, Office Shifts, Car Shifts
 *               businessName:
 *                 type: string
 *                 example: Aggarwal Transports Pvt Ltd
 *               about:
 *                 type: string
 *                 example: Your Moving Partner
 *               gstNumber:
 *                 type: string
 *                 nullable: true
 *                 example: 22AAAAA0000A1Z5
 *               website:
 *                 type: string
 *                 nullable: true
 *                 example: https://www.aggarwaltransports.com
 *               logo:
 *                 type: string
 *                 format: binary
 *                 nullable: true
 *                 description: Organization logo image (JPEG, PNG - max 5MB)
 *               phone:
 *                 type: string
 *                 example: "+911234567873"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aggarwal@gmail.com
 *               country:
 *                 type: string
 *                 example: India
 *               state:
 *                 type: string
 *                 example: Maharashtra
 *               city:
 *                 type: string
 *                 example: Mumbai
 *               pincode:
 *                 type: integer
 *                 example: 400001
 *               addressLine1:
 *                 type: string
 *                 example: 123, Business Street
 *               addressLine2:
 *                 type: string
 *                 nullable: true
 *                 example: 5th Floor, Office 501
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 9
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     organizationName:
 *                       type: string
 *                       example: aggarwal packers & transports
 *                     organizationType:
 *                       type: string
 *                       example: home shift, office shifts, car shifts
 *                     businessName:
 *                       type: string
 *                       example: aggarwal transports pvt ltd
 *                     about:
 *                       type: string
 *                       example: your moving partner
 *                     gstNumber:
 *                       type: string
 *                       nullable: true
 *                       example: 22AAAAA0000A1Z5
 *                     website:
 *                       type: string
 *                       nullable: true
 *                       example: https://www.aggarwaltransports.com
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: "+911234567873"
 *                     email:
 *                       type: string
 *                       example: aggarwal@gmail.com
 *                     country:
 *                       type: string
 *                       example: india
 *                     state:
 *                       type: string
 *                       example: maharashtra
 *                     city:
 *                       type: string
 *                       example: mumbai
 *                     pincode:
 *                       type: integer
 *                       example: 400001
 *                     addressLine1:
 *                       type: string
 *                       example: 123, business street
 *                     addressLine2:
 *                       type: string
 *                       nullable: true
 *                       example: 5th floor, office 501
 *                     status:
 *                       type: string
 *                       example: inactive
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-03T19:04:07.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-03T19:04:07.000Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/organizations/all:
 *   get:
 *     summary: Fetch all organizations for the logged-in admin
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organizations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organizations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       organizationName:
 *                         type: string
 *                         example: moveryy transports
 *                       gstNumber:
 *                         type: string
 *                         nullable: true
 *                         example: 22AAAAA0000A1Z5
 *                       website:
 *                         type: string
 *                         nullable: true
 *                         example: https://www.moveryy.com
 *                       status:
 *                         type: string
 *                         example: active
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/organizations/update:
 *   patch:
 *     summary: Update an organization
 *     description: Updates an existing organization's details. Only **admin users** can perform this action.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organizationName:
 *                 type: string
 *                 example: moveryy packers and movers
 *               organizationType:
 *                 type: string
 *                 example: home shift, office shifts, car shifts
 *               businessName:
 *                 type: string
 *                 example: moveryy transports pvt ltd
 *               about:
 *                 type: string
 *                 example: your moving partner
 *               gstNumber:
 *                 type: string
 *                 nullable: true
 *                 example: 22AAAAA0000A1Z5
 *               website:
 *                 type: string
 *                 nullable: true
 *                 example: https://www.moveryy.com
 *               logo:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               phone:
 *                 type: string
 *                 example: "+911234567890"
 *               email:
 *                 type: string
 *                 example: moveryy@moveryy.com
 *               country:
 *                 type: string
 *                 example: india
 *               state:
 *                 type: string
 *                 example: maharashtra
 *               city:
 *                 type: string
 *                 example: mumbai
 *               pincode:
 *                 type: integer
 *                 example: 400001
 *               addressLine1:
 *                 type: string
 *                 example: 123, business street
 *               addressLine2:
 *                 type: string
 *                 nullable: true
 *                 example: 5th floor, office 501
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     organizationName:
 *                       type: string
 *                       example: moveryy packers and movers
 *                     gstNumber:
 *                       type: string
 *                       nullable: true
 *                       example: 22AAAAA0000A1Z5
 *                     website:
 *                       type: string
 *                       nullable: true
 *                       example: https://www.moveryy.com
 *                     status:
 *                       type: string
 *                       example: active
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-10-06T06:52:34.639Z"
 *       400:
 *         description: Invalid fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/organizations/{organizationId}:
 *   delete:
 *     summary: Delete an organization
 *     description: Deletes an organization by its organizationId. Only **admin users** are authorized.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */
