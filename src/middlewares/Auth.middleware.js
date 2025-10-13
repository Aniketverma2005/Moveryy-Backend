import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/Users/Users.js"; 
import Employee from "../models/Employee.js"
import Organizations from "../models/Organizations.js";



// Get token from cookies or headers
// If no token → reject
// Verify token with secret
// If invalid/expired → reject
// Find user in DB by ID from token
// If not found → reject
// Attach user to req.user
// Pass control to the next function

export const verifyToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiErrors(401, "Unauthorized Request");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiErrors(401, "Invalid or expired access token");
    }

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
    if (!user) throw new ApiErrors(401, "Invalid Access Token");

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: decoded.organizationId || null
    };

    next();
});



export const verifyNewGeneratedToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiErrors(401, "Unauthorized Request");

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiErrors(401, "Invalid or expired access token");
    }

    const user = await User.findByPk(decoded.id, { attributes: { exclude: ["password"] } });
    if (!user) throw new ApiErrors(401, "Invalid Access Token");

    // Fetch all organizations for user
    const orgs = await Organizations.findAll({ where: { userId: user.id } });

    let activeOrg = null;

    if (orgs.length === 1) {
        // Single-org → automatically active
        activeOrg = orgs[0];
        if (activeOrg.status !== "active") {
            activeOrg.status = "active";
            await activeOrg.save();
        }
    } else {
        // Multi-org → must have organizationId in token
        if (!decoded.organizationId) {
            throw new ApiErrors(403, "Please switch to an active organization");
        }

        activeOrg = await Organizations.findOne({
            where: { organizationId: decoded.organizationId, userId: user.id, status: "active" }
        });

        if (!activeOrg) {
            throw new ApiErrors(403, "Organization inactive or not found");
        }
    }

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        organizationId: activeOrg.organizationId
    };

    next();
});



export const verifyEmployeeToken = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer ", "")
        if(!token) {
            throw new ApiErrors(401, "Unauthorized Request")
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiErrors(401, "Invalid or Expired access token")
        }

        const employee = await Employee.findByPk(decodedToken?.employeeId, {attributes: {exclude: ['password', 'refreshToken']}})
        if(!employee) {
            throw new ApiErrors(401, "Invalid Access Token")
        }

        req.employee = {
            id: employee.employeeId,
            email: employee.email,
            role: employee.role,
            organizationId: decodedToken.organizationId
        }

        if (req.employee.role !== "transport") {
            throw new ApiErrors(403, "Employees only");
        }
        next();
    } catch (error) {
        next(error);
    }
})