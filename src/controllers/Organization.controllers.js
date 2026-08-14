import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import { generateTokenWithOrg } from "../utils/GenerateTokenWithOrg.js";
import { Organizations, Vehicles } from "../models/index.js";
import Users from "../models/Users/Users.js";
import { Client } from "@googlemaps/google-maps-services-js";
import Offers from "../models/Offers.js";
import fs from "fs";
import path from "path";
import multer from "multer";

// Ensure logos directory exists
const logosDir = 'uploads/logos';
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Multer storage for logos - use memory storage to avoid stream issues
const logoStorage = multer.memoryStorage();

export const logoUpload = multer({
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WebP images allowed'));
  }
});

const googleClient = new Client({});

const createOrganization = asyncHandler(async (req, res) => {

    //Chack if User has a Valid Token
    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    //Only Admin Users can create Organizations
    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can create organizations");
    }

    console.log('=== CREATE ORG DEBUG ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.body:', JSON.stringify(req.body));
    console.log('req.files keys:', req.files ? Object.keys(req.files) : 'no files');

    const { organizationName, organizationType, businessName, about, gstNumber, website, logo, phone, email, country, state, city, pincode, addressLine1, addressLine2} = req.body;
    console.log('pincode value:', pincode, '| type:', typeof pincode);

    // Handle logo file - works with both multipart/form-data and express-fileupload
    let logoPath = logo || null;
    const logoFile = req.files?.logo || req.files?.Logo;
    if (logoFile) {
      const ext = path.extname(logoFile.name) || '.jpg';
      const filename = `org_${req.user.id}_${Date.now()}${ext}`;
      logoPath = path.join(logosDir, filename);
      await logoFile.mv(logoPath);
    }

    if(Validation.isEmpty(organizationName)) {
        throw new ApiErrors(400, "Organization name is required");
    }
    if(Validation.isEmpty(organizationType)) {
        throw new ApiErrors(400, "Organization type is required");
    }
    if(Validation.isEmpty(phone) || !Validation.validatePhone(phone)) {
        throw new ApiErrors(400, "A valid phone number is required");
    }
    if(Validation.isEmpty(email) || !Validation.validateEmail(email)) {
        throw new ApiErrors(400, "A valid email is required");
    }
    if(Validation.isEmpty(country)) {
        throw new ApiErrors(400, "Country is required");
    }
    if(Validation.isEmpty(state)) {
        throw new ApiErrors(400, "State is required");
    }
    if(Validation.isEmpty(city)) {
        throw new ApiErrors(400, "City is required");
    }
    if(Validation.isEmpty(String(pincode ?? ''))) {
        throw new ApiErrors(400, "Pincode is required");
    }
    if(Validation.isEmpty(addressLine1)) {
        throw new ApiErrors(400, "Address  is required");
    }

    const fullAddress = `${addressLine1}, ${addressLine2 || ""}, ${city}, ${state}, ${country}, ${pincode}`;


    let latitude = null;
    let longitude = null;

    try {
        const geoResponse = await googleClient.geocode({
            params: {
                address: fullAddress,
                key: process.env.GOOGLE_MAPS_API_KEY,
            },
        });

        if(geoResponse.data.results.length > 0) {
            const location = geoResponse.data.results[0].geometry.location;
            latitude = location.lat;
            longitude = location.lng;
        }else{
            console.error("Geocoding failed: no results found");
        }

    } catch (error) {
        console.error("Geocoding Failed", error);
    }


    const existingEmail = await Organizations.findOne({ where: { email } });
    if (existingEmail) {
        throw new ApiErrors(400, "Organization with this email already exists");
    }

    const existingPhone = await Organizations.findOne({ where: { phone } });
    if (existingPhone) {
        throw new ApiErrors(400, "Organization with this phone number already exists");
    }

    const organization = await Organizations.create ({
        organizationName: organizationName.toLowerCase(),
        organizationType: organizationType.toLowerCase(),
        businessName: businessName.toLowerCase(),
        about: about ? about.toLowerCase() : null,
        gstNumber: gstNumber ? gstNumber.toUpperCase() : null,
        website: website ? website.toLowerCase() : null,
        logo: logoPath,
        phone: phone,
        email: email.toLowerCase(),
        country: country.toLowerCase(),
        state: state.toLowerCase(),
        city: city.toLowerCase(),
        pincode: pincode,
        addressLine1: addressLine1.toLowerCase(),
        addressLine2: addressLine2 ? addressLine2.toLowerCase() : null,
        latitude,
        longitude,
        userId: req.user.id
    })

    const createdOrganization = await Organizations.findByPk(organization.organizationId, {
            include: {
                model: Users,
                as: "creator",
                attributes: { exclude: ['password', 'refreshToken'] }
            },
        });

    if(!createdOrganization) {
        throw new ApiErrors(500, "Organization creation failed. Please try again");
    }

    res
    .status(201)
    .json({ 
        message: "Organization created successfully", data: createdOrganization
    });
});


const fetchOrganizations = asyncHandler(async (req, res) =>  {
    const userId = req.user.id;

    if(!userId) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(402, "Only Admin can access this data")
    }

    const organizations = await Organizations.findAll({ where: { userId }, order: [['createdAt', 'ASC']] });
    //console.log(organizations);

    return res
    .status(200)
    .json({ message: "Organizations fetched successfully", data: organizations });
})


const organizationStatus = asyncHandler(async (req, res) => {
    const { organizationId } = req.body;

    if (!organizationId) {
        throw new ApiErrors(400, "Organization ID is required");
    }

    const organization = await Organizations.findOne({
        where: { organizationId, userId: req.user.id },
    });

    if (!organization) {
        throw new ApiErrors(404, "Organization not found or user does not belong to it");
    }

    // Ensure only one org active at a time
    await Organizations.update(
        { status: "inactive" },
        { where: { userId: req.user.id } }
    );

    // Activate the selected organization
    organization.status = "active";
    await organization.save();

    // Generate new token
    const token = await generateTokenWithOrg(req.user.id, organization.organizationId);

    return res.status(200).json({
        message: `Organization '${organization.organizationName}' activated successfully`,
        data: organization,
        token,
    });
});


const uploadOrganizationLogo = asyncHandler(async (req, res) => {
    const { organizationId } = req.params; // from URL

    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Request");
    }

    if (!organizationId) {
        throw new ApiErrors(400, "Organization ID is required");
    }

    // Use express-fileupload (req.files) - same as OCR endpoints
    const logoFile = req.files?.logo || req.files?.Logo;
    if (!req.files || !logoFile) {
        throw new ApiErrors(400, "Please upload a logo image");
    }

    // Verify org belongs to this user
    const organization = await Organizations.findOne({ 
        where: { organizationId, userId: req.user.id } 
    });
    if (!organization) {
        throw new ApiErrors(404, "Organization not found or you don't have permission");
    }

    // Delete old logo if exists
    if (organization.logo && fs.existsSync(organization.logo)) {
        fs.unlinkSync(organization.logo);
    }

    // Save logo file to disk
    const ext = path.extname(logoFile.name) || '.jpg';
    const filename = `org_${organizationId}_${Date.now()}${ext}`;
    const logoPath = path.join(logosDir, filename);
    await logoFile.mv(logoPath);

    await organization.update({ logo: logoPath });

    return res.status(200).json({
        message: "Logo uploaded successfully",
        data: {
            organizationId: organization.organizationId,
            logo: logoPath,
            logoUrl: `${req.protocol}://${req.get('host')}/${logoPath.replace(/\\/g, '/')}`
        }
    });
});

const updateOrganization = asyncHandler(async (req, res) => {
    const { organizationId } = req.user;

    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Request")
    }

    const organization = await Organizations.findOne({ where: { organizationId } });

    if (!organization) {
        throw new ApiErrors(404, "Organization not found or inactive");
    }

    // Handle logo file upload if provided
    if (req.file) {
        // Delete old logo if exists
        if (organization.logo && fs.existsSync(organization.logo)) {
            fs.unlinkSync(organization.logo);
        }
        const ext = path.extname(req.file.originalname) || '.jpg';
        const filename = `org_${req.user.id}_${Date.now()}${ext}`;
        const logoPath = path.join(logosDir, filename);
        fs.writeFileSync(logoPath, req.file.buffer);
        req.body.logo = logoPath;
    }

    // Now safe to call update
    await organization.update(req.body);

    return res
    .status(200)
    .json({
        message: "Organization updated successfully",
        data: organization
    });
});


const deleteOrganization = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;
    const userId = req.user.id;

    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can delete organizations");
    }

    if (!organizationId) {
        throw new ApiErrors(400, "Organization ID is required");
    }

    const organization = await Organizations.findOne({
        where: { 
            organizationId, 
            userId 
        }
    });

    if (!organization) {
        throw new ApiErrors(404, "User is not the part of this organization");
    }

    await organization.destroy();

    return res
    .status(200)
    .json({
        message: "Organization deleted successfully"
    });
})


const fetchOrganizationByPin = asyncHandler(async (req, res) => {
    const { pincode } = req.params;

    if(!req.user) throw new ApiErrors(401, "Unauthorized Access");

    if (!pincode || !Validation.validatePincode(pincode)) {
        throw new ApiErrors(400, "A valid pincode is required");
    }

    const organizations = await Organizations.findAll({ where: { pincode } });

    return res
    .status(200)
    .json({
        message: "Organizations fetched successfully",
        data: organizations
    });
})

const fetchOrganizationById = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;

    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Access")
    }

    if(req.user.role !== "user") {
        throw new ApiErrors(403, "Only users can access this route");
    }

    const organization = await Organizations.findOne({ where: { organizationId } });

    if(!organization) {
        throw new ApiErrors(404, "Organization not found");
    }

    const vehicles = await Vehicles.findAll({
        where: {
            organizationId: organization.organizationId,
            isActive: true
        }
    });

    const offers = await Offers.findAll({
        where: {
            organizationId: organization.organizationId,
            isActive: true
        }
    })

    return res
    .status(200)
    .json({
        message: "Organization fetched successfully",
        data: {
            organization,
            vehicles,
            offers
        }
    })
})






const fetchOrganizationLogo = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;

    if (!req.user) {
        throw new ApiErrors(401, "Unauthorized Access");
    }

    const organization = await Organizations.findByPk(organizationId, {
        attributes: ['organizationId', 'organizationName', 'logo']
    });

    if (!organization) {
        throw new ApiErrors(404, "Organization not found");
    }

    if (!organization.logo) {
        throw new ApiErrors(404, "This organization has no logo");
    }

    const absolutePath = path.resolve(organization.logo);

    if (!fs.existsSync(absolutePath)) {
        throw new ApiErrors(404, "Logo file not found on server");
    }

    const logoUrl = `${req.protocol}://${req.get('host')}/${organization.logo.replace(/\\/g, '/')}`;

    return res.status(200).json({
        message: "Logo fetched successfully",
        data: {
            organizationId: organization.organizationId,
            organizationName: organization.organizationName,
            logo: organization.logo,
            logoUrl
        }
    });
});






export {
    createOrganization,
    fetchOrganizations,
    organizationStatus,
    updateOrganization,
    deleteOrganization,
    fetchOrganizationByPin, 
    fetchOrganizationById,
    uploadOrganizationLogo,
    fetchOrganizationLogo
}
