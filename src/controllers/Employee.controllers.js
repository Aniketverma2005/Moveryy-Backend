import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import Employee from "../models/Employee.js"
import { Validation } from "../utils/Validation.js";
import bcrypt from "bcrypt"
import { generateEmployeeToken } from "../utils/GenerateTokenWithOrg.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

    try {
        const existingEmployee = await Employee.findOne({ where: { email } });
        if (existingEmployee) {
            throw new ApiErrors(400, "Employee with this email is already registered");
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


const loginEmployee = asyncHandler(async(req, res) => {
    const{ email, password} = req.body

    if(!email) {
        throw new ApiErrors(401, "Email is required");
    }

    if(!password) {
        throw new ApiErrors(401, "Enter a valid Password");
    }


    const employee = await Employee.findOne({
        where:{email: email.toLowerCase(), isActive:true}
    })

    if(!employee) {
        throw new ApiErrors(401, "Employee not found")
    }

    const isMatch = await bcrypt.compare(password, employee.password)

    if(!isMatch) {
        throw new ApiErrors(401, "Incorrect password")
    }

    const {accessToken, refreshToken} = await generateEmployeeToken(employee.employeeId)

    if(!accessToken) {
        throw new ApiErrors(500, "Could not generate access token. Please try again");
    }

    employee.refreshToken = refreshToken;
    employee.status = "available";
    await employee.save();

    const loggedInEmployee = await Employee.findByPk(employee.employeeId, {attributes: {exclude: ['password', 'refreshToken']}})
    

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            "Employee logged in Successfully",
            {
                employee: loggedInEmployee, accessToken, refreshToken
            }
        )
    )
})


const getEmployee = asyncHandler(async(req, res) => {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    if(!userId) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if (req.user.role !== "admin") 
        { 
            throw new ApiErrors(403, "Only admin can access this data"); 
        }

    // if(!userId === admin) {
    //     throw new ApiErrors(401, "Only admin can Access this data")
    // }

    const employees = await Employee.findAll({
        where: {organizationId},
        attributes:{exclude:['password']}, 
        order: [['employeeId', 'ASC']]})

    return res
    .status(200)
    .json({
        message:"Employees fetched Successfully",
        employees: employees
    })
})


const fetchEmployeeById = asyncHandler(async(req, res) => {
    const{employeeId} = req.params;
    const userId = req.user.id;
    const organizationId = req.user.organizationId

    if(!userId) {
        throw new ApiErrors(401, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(401, "Only Admin can access this data")
    }

    const employeeid = await Employee.findOne({
        where: { employeeId, organizationId: req.user.organizationId },
        attributes: { exclude: ['password'] }
    });


    if (!employeeid) {
        throw new ApiErrors(404, "Employee not found");
    }


    return res
    .status(200)
    .json({
        message:"Fetched Employee Successfully",
        employee:employeeid
    })
})


const deleteEmployeeById = asyncHandler(async (req, res) => {
    const { employeeId } = req.params;

    if(!employeeId) {
        throw new ApiErrors(401, "Enter Employee Id you want to delete")
    }

    const userId = req.user.id;
    const organizationId = req.user.organizationId;

    if (!userId) {
        throw new ApiErrors(401, "Unauthorized Access");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only Admin can delete employees");
    }

    const employee = await Employee.findOne({
        where: {
            employeeId,
            organizationId,
            isActive: true 
        }
    });

    if (!employee) {
        throw new ApiErrors(404, "Employee not found");
    }

    employee.isActive = false;
    employee.updatedBy = req.user.id;

    await employee.save();

    return res.status(200).json({
        message: "Employee deleted successfully"
    });
});


const logoutEmployee = asyncHandler(async (req, res) => {

    if (!req.employee || req.employee.role !== "transport") {
        throw new ApiErrors(403, "Only employees can log out here");
    }

    await Employee.update(
        {status: 'busy'}, 
        {where: {employeeId: req.employee.id}}
    )


    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Employee logged out successfully"));
});


const changeStatus = asyncHandler(async(req, res) => {
    if (!req.employee || req.employee.role !== "transport") {
        throw new ApiErrors(403, "Only employees can change their status");
    }

    const { status } = req.body; // expecting "available" or "busy"

    // Optional: validate status
    if (!["available", "busy"].includes(status)) {
        throw new ApiErrors(400, "Invalid status value");
    }

    // Update the logged-in employee's status
    await Employee.update(
        { status },
        { where: { employeeId: req.employee.id } }
    );

    return res.status(200).json({
        status: 200,
        message: `Status updated to '${status}' successfully`,
        data: { employeeId: req.employee.id, status }
    });
})


export {
    createEmployee, 
    loginEmployee, 
    getEmployee, 
    fetchEmployeeById, 
    deleteEmployeeById, 
    logoutEmployee,
    changeStatus
};