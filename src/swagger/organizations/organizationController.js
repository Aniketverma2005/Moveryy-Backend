/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management (admin only)
 * 
 * 
 *
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
 *       - **about**: required, min 3 characters
 *       - **domain**: required, must be valid hostname, unique
 *       - **subdomain**: required, lowercase alphanumeric/hyphen, ≤100 chars, unique
 *       - **phone**: required, `+` optional, 7–15 digits
 *       - **email**: required, must be valid email, unique
 *       - **logo**: optional, must be valid URL if provided
 *       - **country**: required, min 2 chars
 *       - **state**: required, min 2 chars
 *       - **city**: required, min 2 chars
 *       - **pincode**: required, numeric, 3–10 digits
 *       - **addressLine1**: required, min 3 characters
 *       - **addressLine2**: required, min 3 characters
 *
 *       Uniqueness is enforced on `domain`, `subdomain`, and `email`.
 *       Creator is automatically linked as an `admin` in the new organization.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationName
 *               - organizationType
 *               - businessName
 *               - about
 *               - domain
 *               - subdomain
 *               - phone
 *               - email
 *               - country
 *               - state
 *               - city
 *               - pincode
 *               - addressLine1
 *               - addressLine2
 *             properties:
 *               organizationName:
 *                 type: string
 *                 minLength: 3
 *                 example: Aggarwal Packers & transports
 *               organizationType:
 *                 type: string
 *                 minLength: 3
 *                 example: Home Shift, Office Shifts, Car Shifts
 *               businessName:
 *                 type: string
 *                 minLength: 3
 *                 example: Aggarwal Transports Pvt Ltd
 *               about:
 *                 type: string
 *                 minLength: 3
 *                 example: Your Moving Partner
 *               domain:
 *                 type: string
 *                 format: hostname
 *                 example: newaggarwal1.com
 *               subdomain:
 *                 type: string
 *                 pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
 *                 example: newaggarwal1
 *               phone:
 *                 type: string
 *                 pattern: "^[+][0-9]{7,15}$"
 *                 example: "+911234567873"
 *               logo:
 *                 type: string
 *                 nullable: true
 *                 example: ""
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aggarwal2@gmail.com
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 example: India
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 example: Maharashtra
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 example: Mumbai
 *               pincode:
 *                 type: integer
 *                 minimum: 100000
 *                 maximum: 999999
 *                 example: 400001
 *               addressLine1:
 *                 type: string
 *                 minLength: 3
 *                 example: 123, Business Street
 *               addressLine2:
 *                 type: string
 *                 minLength: 3
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
 *                     domain:
 *                       type: string
 *                       example: newaggarwal1.com
 *                     subdomain:
 *                       type: string
 *                       example: newaggarwal1
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: "+911234567873"
 *                     email:
 *                       type: string
 *                       example: aggarwal2@gmail.com
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
 *                       example: 5th floor, office 501
 *                     status:
 *                       type: string
 *                       example: inactive
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-03T19:04:07.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-03T19:04:07.000Z
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         firstName:
 *                           type: string
 *                           example: aniket
 *                         lastName:
 *                           type: string
 *                           example: verma
 *                         email:
 *                           type: string
 *                           example: aniket@moveryy.com
 *                         phone:
 *                           type: string
 *                           example: +918776352434
 *                         role:
 *                           type: string
 *                           example: admin
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-09-27T11:49:45.000Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-10-03T19:01:45.000Z
 *       400:
 *         description: Validation error (field missing or invalid format)
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Internal server error
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
 * /api/v1/organizations/all:
 *   get:
 *     summary: Fetch all organizations for the logged-in admin
 *     description: Retrieves all organizations created or managed by the currently authenticated admin user.
 *     tags:
 *       - Organization
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
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       organizationName:
 *                         type: string
 *                         example: moveryy transports
 *                       organizationType:
 *                         type: string
 *                         example: home shift, office shifts, car shifts
 *                       businessName:
 *                         type: string
 *                         example: moveryy transports pvt ltd
 *                       about:
 *                         type: string
 *                         example: your moving partner
 *                       domain:
 *                         type: string
 *                         example: moveryy.com
 *                       subdomain:
 *                         type: string
 *                         example: moveryy
 *                       logo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       phone:
 *                         type: string
 *                         example: +911234567890
 *                       email:
 *                         type: string
 *                         example: moveryy@moveryy.com
 *                       country:
 *                         type: string
 *                         example: india
 *                       state:
 *                         type: string
 *                         example: maharashtra
 *                       city:
 *                         type: string
 *                         example: mumbai
 *                       pincode:
 *                         type: integer
 *                         example: 400001
 *                       addressLine1:
 *                         type: string
 *                         example: 123, business street
 *                       addressLine2:
 *                         type: string
 *                         example: 5th floor, office 501
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-04T13:47:19.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-05T13:15:28.000Z
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not authorized)
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/organizations/{organizationId}:
 *   delete:
 *     summary: Delete an organization
 *     description: |
 *       Deletes an organization by its **organizationId**.  
 *       Only **admin users** are authorized to perform this action.
 *     tags:
 *       - Organization
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         description: Unique ID of the organization to delete
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Organization deleted successfully
 *       400:
 *         description: Bad request (invalid organization ID or cannot delete)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not authorized)
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management (admin only)
 */

/**
 * /api/v1/organizations/create:
 *   post:
 *     summary: Create a new Organization
 *     description: |
 *       Creates a new organization. Only **admin users** are allowed to perform this action.
 *       Uniqueness is enforced on `domain`, `subdomain`, and `email`.
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationName
 *               - organizationType
 *               - businessName
 *               - about
 *               - domain
 *               - subdomain
 *               - phone
 *               - email
 *               - country
 *               - state
 *               - city
 *               - pincode
 *               - addressLine1
 *               - addressLine2
 *             properties:
 *               organizationName:
 *                 type: string
 *                 minLength: 3
 *                 example: Aggarwal Packers & transports
 *               organizationType:
 *                 type: string
 *                 minLength: 3
 *                 example: Home Shift, Office Shifts, Car Shifts
 *               businessName:
 *                 type: string
 *                 minLength: 3
 *                 example: Aggarwal Transports Pvt Ltd
 *               about:
 *                 type: string
 *                 minLength: 3
 *                 example: Your Moving Partner
 *               domain:
 *                 type: string
 *                 format: hostname
 *                 example: newaggarwal1.com
 *               subdomain:
 *                 type: string
 *                 pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$"
 *                 example: newaggarwal1
 *               phone:
 *                 type: string
 *                 pattern: "^[+][0-9]{7,15}$"
 *                 example: "+911234567873"
 *               logo:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aggarwal2@gmail.com
 *               country:
 *                 type: string
 *                 minLength: 2
 *                 example: India
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 example: Maharashtra
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 example: Mumbai
 *               pincode:
 *                 type: integer
 *                 minimum: 100000
 *                 maximum: 999999
 *                 example: 400001
 *               addressLine1:
 *                 type: string
 *                 minLength: 3
 *                 example: 123, Business Street
 *               addressLine2:
 *                 type: string
 *                 minLength: 3
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
 *                     domain:
 *                       type: string
 *                       example: newaggarwal1.com
 *                     subdomain:
 *                       type: string
 *                       example: newaggarwal1
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: "+911234567873"
 *                     email:
 *                       type: string
 *                       example: aggarwal2@gmail.com
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
 *                       example: 5th floor, office 501
 *                     status:
 *                       type: string
 *                       example: inactive
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-03T19:04:07.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-03T19:04:07.000Z
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         firstName:
 *                           type: string
 *                           example: aniket
 *                         lastName:
 *                           type: string
 *                           example: verma
 *                         email:
 *                           type: string
 *                           example: aniket@moveryy.com
 *                         phone:
 *                           type: string
 *                           example: +918776352434
 *                         role:
 *                           type: string
 *                           example: admin
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-09-27T11:49:45.000Z
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-10-03T19:01:45.000Z
 *       400:
 *         description: Validation error (field missing or invalid format)
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/organizations/all:
 *   get:
 *     summary: Fetch all organizations for the logged-in admin
 *     description: Retrieves all organizations created or managed by the currently authenticated admin user.
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
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                       organizationName:
 *                         type: string
 *                         example: moveryy transports
 *                       organizationType:
 *                         type: string
 *                         example: home shift, office shifts, car shifts
 *                       businessName:
 *                         type: string
 *                         example: moveryy transports pvt ltd
 *                       about:
 *                         type: string
 *                         example: your moving partner
 *                       domain:
 *                         type: string
 *                         example: moveryy.com
 *                       subdomain:
 *                         type: string
 *                         example: moveryy
 *                       logo:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       phone:
 *                         type: string
 *                         example: +911234567890
 *                       email:
 *                         type: string
 *                         example: moveryy@moveryy.com
 *                       country:
 *                         type: string
 *                         example: india
 *                       state:
 *                         type: string
 *                         example: maharashtra
 *                       city:
 *                         type: string
 *                         example: mumbai
 *                       pincode:
 *                         type: integer
 *                         example: 400001
 *                       addressLine1:
 *                         type: string
 *                         example: 123, business street
 *                       addressLine2:
 *                         type: string
 *                         example: 5th floor, office 501
 *                       status:
 *                         type: string
 *                         example: active
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-04T13:47:19.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-05T13:15:28.000Z
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
 *     parameters:
 *       - name: organizationId
 *         in: path
 *         required: true
 *         description: ID of the organization to update
 *         schema:
 *           type: integer
 *           example: 10
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
 *               domain:
 *                 type: string
 *                 example: moveryy.com
 *               subdomain:
 *                 type: string
 *                 example: moveryy
 *               logo:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               phone:
 *                 type: string
 *                 example: +911234567890
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
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     organizationName:
 *                       type: string
 *                       example: moveryy packers and movers
 *                     organizationType:
 *                       type: string
 *                       example: home shift, office shifts, car shifts
 *                     businessName:
 *                       type: string
 *                       example: moveryy transports pvt ltd
 *                     about:
 *                       type: string
 *                       example: your moving partner
 *                     domain:
 *                       type: string
 *                       example: moveryy.com
 *                     subdomain:
 *                       type: string
 *                       example: moveryy
 *                     logo:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     phone:
 *                       type: string
 *                       example: +911234567890
 *                     email:
 *                       type: string
 *                       example: moveryy@moveryy.com
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
 *                       example: 5th floor, office 501
 *                     status:
 *                       type: string
 *                       example: active
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-04T13:47:19.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-05T13:34:23.182Z
 */
