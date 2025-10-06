/**
 * @swagger
 * tags:
 *   - name: Employees
 *     description: Employee Management (admin only)
 *
 * /api/v1/employees/create:
 *   post:
 *     summary: Create a new employee
 *     description: Allows an admin to create a new employee within their organization.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeName
 *               - email
 *               - password
 *               - role
 *               - gender
 *               - address
 *               - phone
 *               - aadharNumber
 *               - panNumber
 *             properties:
 *               employeeName:
 *                 type: string
 *                 example: Joe Root
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joeroot@gmail.com
 *               password:
 *                 type: string
 *                 example: JoeRoot@123
 *               role:
 *                 type: string
 *                 enum: [admin, user, transport]
 *                 example: transport
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               address:
 *                 type: string
 *                 example: New Delhi, Hauz Khas
 *               phone:
 *                 type: string
 *                 example: +918773523452
 *               aadharNumber:
 *                 type: string
 *                 example: 123456789332
 *               panNumber:
 *                 type: string
 *                 example: AF45DS2
 *     responses:
 *       201:
 *         description: Employee created successfully
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
 *                   example: Employee Created Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: integer
 *                       example: 4
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     employeeName:
 *                       type: string
 *                       example: Joe Root
 *                     email:
 *                       type: string
 *                       example: joeroot@gmail.com
 *                     phone:
 *                       type: string
 *                       example: +918773523452
 *                     role:
 *                       type: string
 *                       example: transport
 *       400:
 *         description: Validation error (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/employees/all:
 *   get:
 *     summary: Fetch all employees in the organization
 *     description: Returns a list of all employees under the logged-in admin's organization.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employees fetched Successfully
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       employeeId:
 *                         type: integer
 *                         example: 4
 *                       organizationId:
 *                         type: integer
 *                         example: 10
 *                       employeeName:
 *                         type: string
 *                         example: Joe Root
 *                       email:
 *                         type: string
 *                         example: joeroot@gmail.com
 *                       phone:
 *                         type: string
 *                         example: +918773523452
 *                       role:
 *                         type: string
 *                         example: transport
 *                       gender:
 *                         type: string
 *                         example: male
 *                       aadharNumber:
 *                         type: string
 *                         example: 123456789332
 *                       panNumber:
 *                         type: string
 *                         example: AF45DS2
 *                       address:
 *                         type: string
 *                         example: New Delhi, Hauz Khas
 *                       status:
 *                         type: string
 *                         example: busy
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       isBlacklisted:
 *                         type: boolean
 *                         example: false
 *                       blacklistReason:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       createdBy:
 *                         type: integer
 *                         example: 1
 *                       updatedBy:
 *                         type: integer
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-05T15:30:50.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2025-10-05T15:30:50.000Z
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/employee/{id}:
 *   get:
 *     summary: Fetch a single employee by ID
 *     description: Returns detailed information about a specific employee using their employee ID.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Unique employee ID
 *         schema:
 *           type: integer
 *           example: 4
 *     responses:
 *       200:
 *         description: Fetched employee successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched Employee Successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: integer
 *                       example: 4
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     employeeName:
 *                       type: string
 *                       example: Joe Root
 *                     email:
 *                       type: string
 *                       example: joeroot@gmail.com
 *                     phone:
 *                       type: string
 *                       example: +918773523452
 *                     role:
 *                       type: string
 *                       example: transport
 *                     gender:
 *                       type: string
 *                       example: male
 *                     aadharNumber:
 *                       type: string
 *                       example: 123456789332
 *                     panNumber:
 *                       type: string
 *                       example: AF45DS2
 *                     address:
 *                       type: string
 *                       example: New Delhi, Hauz Khas
 *                     status:
 *                       type: string
 *                       example: busy
 *                     refreshToken:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isBlacklisted:
 *                       type: boolean
 *                       example: false
 *                     blacklistReason:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     updatedBy:
 *                       type: integer
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-05T15:30:50.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-05T15:30:50.000Z
 *       404:
 *         description: Employee not found
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/employee/{employeeId}:
 *   delete:
 *     summary: Delete an employee by ID
 *     description: Allows an admin to delete an employee from their organization. The employee record will be soft-deleted (isActive set to false).
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: ID of the employee to delete
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee deleted successfully
 *       400:
 *         description: Invalid employee ID supplied
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Only admin can delete employees or admin not part of the same organization
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/employee/{employeeId}:
 *   patch:
 *     summary: Update employee details
 *     description: Allows an admin to update an employee’s details within their organization.
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: employeeId
 *         in: path
 *         required: true
 *         description: ID of the employee to update
 *         schema:
 *           type: integer
 *           example: 4
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeName:
 *                 type: string
 *                 example: Joe Root
 *               email:
 *                 type: string
 *                 example: joeroot@gmail.com
 *               phone:
 *                 type: string
 *                 example: +918773523452
 *               role:
 *                 type: string
 *                 enum: [admin, user, transport]
 *                 example: transport
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               address:
 *                 type: string
 *                 example: New Delhi, near Jama Masjid
 *               aadharNumber:
 *                 type: string
 *                 example: 123456789332
 *               panNumber:
 *                 type: string
 *                 example: AF45DS2
 *               status:
 *                 type: string
 *                 example: busy
 *     responses:
 *       200:
 *         description: Employee details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee details updated Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     employeeId:
 *                       type: integer
 *                       example: 4
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     employeeName:
 *                       type: string
 *                       example: Joe Root
 *                     email:
 *                       type: string
 *                       example: joeroot@gmail.com
 *                     phone:
 *                       type: string
 *                       example: +918773523452
 *                     role:
 *                       type: string
 *                       example: transport
 *                     gender:
 *                       type: string
 *                       example: male
 *                     aadharNumber:
 *                       type: string
 *                       example: 123456789332
 *                     panNumber:
 *                       type: string
 *                       example: AF45DS2
 *                     address:
 *                       type: string
 *                       example: New Delhi, near Jama Masjid
 *                     status:
 *                       type: string
 *                       example: busy
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isBlacklisted:
 *                       type: boolean
 *                       example: false
 *                     blacklistReason:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     createdBy:
 *                       type: integer
 *                       example: 1
 *                     updatedBy:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-05T15:30:50.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-10-06T06:52:34.639Z
 *       400:
 *         description: Invalid or missing fields
 *       401:
 *         description: Unauthorized (missing or invalid JWT token)
 *       403:
 *         description: Only admin can update employee details
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/employee:
 *   get:
 *     tags: [Employees]
 *     summary: Count total employees in the organization (admin only)
 *     description: Returns the total number of employees in the logged-in admin's organization.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employee count fetched successfully
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
 *                   example: Employee count fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizationId:
 *                       type: integer
 *                       example: 10
 *                     totalEmployees:
 *                       type: integer
 *                       example: 2
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Only admin users can access this API
 */
