/**
 * @swagger
 * tags:
 *   - name: OCR
 *     description: Document OCR extraction for driver verification
 */

/**
 * @swagger
 * /api/v1/ocr/extract-dl:
 *   post:
 *     summary: Extract details from Driving License image
 *     description: |
 *       Upload a driving license image and extract details using OCR.
 *       Returns extracted fields like license number, name, DOB, and expiry date.
 *       **Note:** Always show extracted data to the driver for confirmation before saving.
 *     tags:
 *       - OCR
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Driving license image (JPEG, PNG, WebP - max 5MB)
 *     responses:
 *       200:
 *         description: DL details extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Driving license details extracted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       example: Driving License
 *                     extracted:
 *                       type: object
 *                       properties:
 *                         licenseNumber:
 *                           type: string
 *                           nullable: true
 *                           example: MH0120230012345
 *                         name:
 *                           type: string
 *                           nullable: true
 *                           example: RAJESH KUMAR
 *                         dateOfBirth:
 *                           type: string
 *                           nullable: true
 *                           example: 15/05/1990
 *                         licenseExpiry:
 *                           type: string
 *                           nullable: true
 *                           example: 31/12/2028
 *                         address:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         raw:
 *                           type: string
 *                           description: Raw OCR text extracted from image
 *                     note:
 *                       type: string
 *                       example: Please verify the extracted details before submitting
 *       400:
 *         description: No image uploaded, invalid file type, or license expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Driving license expired on 08/02/2026. Please upload a valid license."
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       example: Driving License
 *                     extracted:
 *                       type: object
 *                       properties:
 *                         licenseNumber:
 *                           type: string
 *                           example: DL0420110149646
 *                         name:
 *                           type: string
 *                           example: ANURAG BREJA
 *                         dateOfBirth:
 *                           type: string
 *                           example: 09/02/1976
 *                         licenseExpiry:
 *                           type: string
 *                           example: 08/02/2026
 *                     expiryDate:
 *                       type: string
 *                       description: The expiry date extracted from the license
 *                       example: 08/02/2026
 *                     isExpired:
 *                       type: boolean
 *                       description: true if the license has expired
 *                       example: true
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/ocr/extract-pan:
 *   post:
 *     summary: Extract details from PAN Card image
 *     description: |
 *       Upload a PAN card image and extract details using OCR.
 *       Returns extracted fields like PAN number, name, father's name, and DOB.
 *       **Note:** Always show extracted data to the driver for confirmation before saving.
 *     tags:
 *       - OCR
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: PAN card image (JPEG, PNG, WebP - max 5MB)
 *     responses:
 *       200:
 *         description: PAN details extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: PAN card details extracted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       example: PAN Card
 *                     extracted:
 *                       type: object
 *                       properties:
 *                         panNumber:
 *                           type: string
 *                           nullable: true
 *                           example: ABCDE1234F
 *                         name:
 *                           type: string
 *                           nullable: true
 *                           example: RAJESH KUMAR
 *                         fatherName:
 *                           type: string
 *                           nullable: true
 *                           example: SURESH KUMAR
 *                         dateOfBirth:
 *                           type: string
 *                           nullable: true
 *                           example: 15/05/1990
 *                         raw:
 *                           type: string
 *                           description: Raw OCR text extracted from image
 *                     note:
 *                       type: string
 *                       example: Please verify the extracted details before submitting
 *       400:
 *         description: No image uploaded or invalid file type
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/ocr/extract-aadhar:
 *   post:
 *     summary: Extract details from Aadhar Card image
 *     description: |
 *       Upload an Aadhar card image and extract details using OCR.
 *       Returns extracted fields like Aadhar number, name, DOB, and gender.
 *       **Note:** Always show extracted data to the driver for confirmation before saving.
 *     tags:
 *       - OCR
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - document
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Aadhar card image (JPEG, PNG, WebP - max 5MB)
 *     responses:
 *       200:
 *         description: Aadhar details extracted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Aadhar card details extracted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     documentType:
 *                       type: string
 *                       example: Aadhar Card
 *                     extracted:
 *                       type: object
 *                       properties:
 *                         aadharNumber:
 *                           type: string
 *                           nullable: true
 *                           example: "123456789012"
 *                         name:
 *                           type: string
 *                           nullable: true
 *                           example: Rajesh Kumar
 *                         dateOfBirth:
 *                           type: string
 *                           nullable: true
 *                           example: 15/05/1990
 *                         gender:
 *                           type: string
 *                           nullable: true
 *                           example: male
 *                         raw:
 *                           type: string
 *                           description: Raw OCR text extracted from image
 *                     note:
 *                       type: string
 *                       example: Please verify the extracted details before submitting
 *       400:
 *         description: No image uploaded or invalid file type
 *       500:
 *         description: Internal server error
 */
