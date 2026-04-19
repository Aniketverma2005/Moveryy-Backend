import Organizations from "../models/Organizations.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const activeOrganization = asyncHandler(async (req, res, next) => {
    const organization = await Organizations.findOne({ where: { userId: req.user.id, status: 'active' } });
    if (!organization) {
        throw new ApiErrors(404, "No active organization found for this user");
    }

    req.organization = organization
    next();
});

export default activeOrganization;