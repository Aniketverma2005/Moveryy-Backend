import jwt from "jsonwebtoken"
import { ApiErrors } from "./ApiErrors.js";
import User from "../models/Users/Users.js";
import Employee from "../models/Employee/Employee.js"
import dotenv from 'dotenv';
dotenv.config();



const generateTokenWithOrg = async (userId, organizationId) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ApiErrors(400, "User not found");
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
            organizationId: organizationId
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("JWT generation failed:", error);
        throw new ApiErrors(400, "Could not generate Token");
    }
}


const generateEmployeeToken = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw new ApiErrors(401, "Employee not found");

  const payload = {
    employeeId: employee.employeeId,
    role: employee.role,
    organizationId: employee.organizationId
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};


export {generateTokenWithOrg, generateEmployeeToken}
