import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import Employee from "../models/Employee.js"
import { Validation } from "../utils/Validation.js";
import bcrypt from "bcrypt"

const createEmployee = asyncHandler(async(req, res) => {
    const{
        employeeName,
        email,
        password,
        phone, 
        role,
        gender,
        aadharNumber,
        panNumber,
        address 
    } = req.body;

    if(!req.user) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin users can create organizations");
    }

    const organizationId = req.user.organizationId;

    if (!organizationId) {
        throw new ApiErrors(400, "Admin user does not belong to any organization");
    }

    if(Validation.isEmpty(employeeName)) {
        throw new ApiErrors(400, "Employee name Required")
    }

    if(Validation.isEmpty(email) || !Validation.validateEmail(email)) {
        throw new ApiErrors(400, "Enter a valid Email")
    }

    if(Validation.isEmpty(password) || password.length < 8) {
        throw new ApiErrors(400, "Password must be of Atleast 8 characters")
    }

    if(Validation.isEmpty(phone) || !Validation.validatePhone(phone)) {
        throw new ApiErrors(400, "Enter valid Phone Number")
    }

    if(Validation.isEmpty(role) || !["transport"].includes(role)) {
        throw new ApiErrors(400, "Role is required and must be transport")
    }

    if(Validation.isEmpty(gender) || !["male", "female", "others"].includes(gender)) {
        throw new ApiErrors(400, "Gender is required and must be of: male, female, others")
    }

    if(Validation.isEmpty(aadharNumber) || aadharNumber.length < 12){
        throw new ApiErrors(400, "Enter a valid Aadhar Number")
    }

    if(Validation.isEmpty(panNumber)) {
        throw new ApiErrors(400, "Pan Number is required")
    }

    if(Validation.isEmpty(address)) {
        throw new ApiErrors(400, "Address is required")
    }


    try {
        const existingEmployee = await Employee.findOne({where :{aadharNumber}});
        if(existingEmployee) {
            throw new ApiErrors(400, "Employee with this email is already registered")
        }
    } catch (error) {
        console.log("Sequelize Error", error)
        throw error
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newEmployee = await Employee.create({
        organizationId,
        employeeName,
        email,
        password: hashPassword,
        phone,
        role,
        gender,
        aadharNumber,
        panNumber,
        address,
        createdBy: req.user.id
    })

    return res
    .status(200)
    .json({
        success:true,
        message:"Employee Created Successfully",
        data:{
            employeeId: newEmployee.employeeId,
            organizationId: newEmployee.organizationId,
            createdBy: newEmployee.createdBy,
            employeeName: newEmployee.employeeName,
            email: newEmployee.email,
            phone: newEmployee.phone,
            role: newEmployee.role,
        }

    }); 
});

export {createEmployee};