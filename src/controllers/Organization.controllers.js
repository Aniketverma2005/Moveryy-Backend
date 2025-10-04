import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { Validation } from "../utils/Validation.js";
import { generateTokenWithOrg } from "../utils/GenerateTokenWithOrg.js";
import { Organizations } from "../models/index.js";
import Users from "../models/Users.js";




const createOrganization = asyncHandler(async (req, res) => {

    //Chack if User has a Valid Token
    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    //Only Admin Users can create Organizations
    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can create organizations");
    }

    const { organizationName, organizationType, businessName, about, domain, subdomain, logo, phone, email, country, state, city, pincode, addressLine1, addressLine2} = req.body;

    if(Validation.isEmpty(organizationName)) {
        throw new ApiErrors(400, "Organization name is required");
    }
    if(Validation.isEmpty(organizationType)) {
        throw new ApiErrors(400, "Organization type is required");
    }
    if(Validation.isEmpty(domain) || !Validation.validateDomain(domain)) {
        throw new ApiErrors(400, "Domain is required");
    }
    if(Validation.isEmpty(subdomain) || !Validation.validateSubdomain(subdomain)) {
        throw new ApiErrors(400, "Subdomain is required");
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
    if(Validation.isEmpty(pincode) || !Validation.validatePincode(pincode)) {
        throw new ApiErrors(400, "A valid pincode is required");
    }
    if(Validation.isEmpty(addressLine1)) {
        throw new ApiErrors(400, "Address  is required");
    }

    const existingOrg = await Organizations.findOne({ where: { domain } });
    if (existingOrg) throw new ApiErrors(400, "Organization with this domain already exists");

    const existingSubdomain = await Organizations.findOne({ where: { subdomain } });
    if (existingSubdomain) {
        throw new ApiErrors(400, "Organization with this subdomain already exists");
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
        domain: domain.toLowerCase(),
        subdomain: subdomain.toLowerCase(),
        logo: logo || null,
        phone: phone,
        email: email.toLowerCase(),
        country: country.toLowerCase(),
        state: state.toLowerCase(),
        city: city.toLowerCase(),
        pincode: pincode,
        addressLine1: addressLine1.toLowerCase(),
        addressLine2: addressLine2 ? addressLine2.toLowerCase() : null,
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



const updateOrganization = asyncHandler(async (req, res) => {
    const organization = req.organization;
    const updateData = req.body;

    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Request")
    }

    await organization.update(updateData);

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






export {
    createOrganization,
    fetchOrganizations,
    organizationStatus,
    updateOrganization,
    deleteOrganization
}

// {
//   "organizationName": "Moveryy transports",
//   "organizationType": "Home Shift, Office Shifts, Car Shifts",
//   "businessName": "Moveryy Transports Pvt Ltd",
//   "about": "Your Moving Partner",
//   "domain": "moveryy.com",
//   "subdomain": "moveryy",
//   "phone": "+911234567890",
//   "logo":"",
//   "email": "moveryy@moveryy.com",
//   "country": "India",
//   "state": "Maharashtra",
//   "city": "Mumbai",
//   "pincode": 400001,
//   "addressLine1": "123, Business Street",
//   "addressLine2": "5th Floor, Office 501"
// }
