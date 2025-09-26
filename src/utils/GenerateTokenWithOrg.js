import jwt from "jsonwebtoken"
import { ApiErrors } from "./ApiErrors.js";
import User from "../models/Users.js";


const generateTokenWithOrg = async (userId, organizationId) => {
    try {
        const user = await User.findByPk(userId);
        if(!user) {
            throw new ApiErrors(400, "User not found");
        }

        const payload = {
            id : user.id,
            email: user.email,
            role: user.role,
            organizationId:organizationId
        }

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        return accessToken
        
    } catch (error) {
        throw new ApiErrors(400, "Could not generate Token")
    }
}

export {generateTokenWithOrg}
