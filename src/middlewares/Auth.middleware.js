import { ApiErrors } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/Users.js"; 
import Employee from "../models/Employee.js"



// Get token from cookies or headers
// If no token → reject
// Verify token with secret
// If invalid/expired → reject
// Find user in DB by ID from token
// If not found → reject
// Attach user to req.user
// Pass control to the next function

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer ", "")
        if(!token) { throw new ApiErrors(401, "Unauthorized Request") }
    
        //Decode token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiErrors(401, "Invalid or expired access token");
        }

        //Get User by token
        const user = await User.findByPk(decodedToken?.id, {attributes: {exclude: ['password']}})
        if(!user) { throw new ApiErrors(401, "Invalid Access Token") }
    
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: decodedToken.organizationId
        }

        if (req.user.role !== "admin") {
            throw new ApiErrors(403, "Admin only");
        }
        next();

    } catch (error) {
        next(error);
    }
});


export const verifyNewGeneratedToken = asyncHandler(async(req, res, next) => {
    try {
       const token = req.cookies?.accessToken || req.header ("Authorization")?.replace("Bearer ", "")
       if(!token) {
        throw new ApiErrors(401, "Unauthorized Request")
       } 

       let decodeToken;
       try {
        decodeToken = jwt.verify(token, process.env.JWT_SECRET);
       }catch(error) {
        throw new ApiErrors(401, "Invalid or expired access token");
       }

       const user = await User.findByPk(decodeToken?.id, { attributes: { exclude: ['password'] } });
        if (!user) throw new ApiErrors(401, "Invalid Access Token");

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: decodeToken.organizationId || null
        };

        next();


    } catch (error) {
        throw new ApiErrors(400, error?.message || "Invalid Access Token")
    }
})


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