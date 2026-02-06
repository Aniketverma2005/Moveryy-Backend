import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import Employee from "../../models/Employee/Employee.js"
import { Validation } from "../../utils/Validation.js";
import bcrypt from "bcrypt"
import { generateEmployeeToken } from "../../utils/GenerateTokenWithOrg.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Op } from "sequelize";
import Vehicles from "../../models/Vehicles.js";
import Bookings from "../../models/Bookings/Bookings.js";


const createEmployee = asyncHandler(async (req, res) => {
  const {
    employeeName,
    email,
    password,
    phone,
    vehicleId,
    role,
    gender,
    aadharNumber,
    panNumber,
    address
  } = req.body;

  // ---------------- AUTH ----------------
  if (!req.user) {
    throw new ApiErrors(401, "Unauthorized Token");
  }

  if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin users can create employees");
  }

  const organizationId = req.user.organizationId;
  if (!organizationId) {
    throw new ApiErrors(400, "Admin user does not belong to any organization");
  }

  // ---------------- VALIDATION ----------------
  if (Validation.isEmpty(employeeName)) {
    throw new ApiErrors(400, "Employee name is required");
  }

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "Enter a valid email");
  }

  if (Validation.isEmpty(password) || password.length < 8) {
    throw new ApiErrors(400, "Password must be at least 8 characters");
  }

  if (Validation.isEmpty(phone) || !Validation.validatePhone(phone)) {
    throw new ApiErrors(400, "Enter a valid phone number");
  }

  if (!["driver", "crew"].includes(role)) {
    throw new ApiErrors(400, "Role must be driver or crew");
  }

  if (role === "driver" && !vehicleId) {
    throw new ApiErrors(400, "Driver must have a vehicle assigned");
  }

  if (role !== "driver" && vehicleId) {
    throw new ApiErrors(400, "Only drivers can be assigned a vehicle");
  }

  if (!["male", "female", "others"].includes(gender)) {
    throw new ApiErrors(400, "Gender must be male, female, or others");
  }

  if (Validation.isEmpty(aadharNumber) || aadharNumber.length < 12) {
    throw new ApiErrors(400, "Enter a valid Aadhar number");
  }

  if (Validation.isEmpty(panNumber)) {
    throw new ApiErrors(400, "Pan number is required");
  }

  if (Validation.isEmpty(address)) {
    throw new ApiErrors(400, "Address is required");
  }

  // ---------------- DUPLICATE CHECKS ----------------
  const existingEmployee = await Employee.findOne({
    where: {
      [Op.or]: [{ email }, { aadharNumber }]
    }
  });

  if (existingEmployee) {
    throw new ApiErrors(400, "Employee with same email or aadhar already exists");
  }

  // ---------------- VEHICLE SAFETY CHECK ----------------
  if (role === "driver") {
    const vehicle = await Vehicles.findByPk(vehicleId);

    if (!vehicle) {
      throw new ApiErrors(404, "Vehicle not found");
    }

    if (vehicle.driverId) {
      throw new ApiErrors(400, "This vehicle already has a driver assigned");
    }
  }

  // ---------------- CREATE EMPLOYEE ----------------
  // ---------------- CREATE EMPLOYEE ----------------
const cleanPassword = password.trim();

const hashPassword = await bcrypt.hash(cleanPassword, 10);

const newEmployee = await Employee.create({
  organizationId,
  employeeName,
  email: email.toLowerCase(), // normalize
  password: hashPassword,
  phone,
  vehicleId: role === "driver" ? vehicleId : null,
  role,
  gender,
  aadharNumber,
  panNumber,
  address,
  createdBy: req.user.id
});


  // ---------------- UPDATE VEHICLE (MOST IMPORTANT FIX) ----------------
  if (role === "driver" && vehicleId) {
    await Vehicles.update(
      { driverId: newEmployee.employeeId },
      { where: { vehicleId } }
    );
  }

  // ---------------- RESPONSE ----------------
  return res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: {
      employeeId: newEmployee.employeeId,
      organizationId: newEmployee.organizationId,
      employeeName: newEmployee.employeeName,
      email: newEmployee.email,
      phone: newEmployee.phone,
      role: newEmployee.role,
      vehicleId: newEmployee.vehicleId
    }
  });
});



const loginEmployee = asyncHandler(async (req, res) => {
  const { email, password, passowrd } = req.body;
  
  // Handle common typo in frontend - use correct password or the typo version
  const actualPassword = password || passowrd;

  if (!email || Validation.isEmpty(email)) {
    throw new ApiErrors(401, "Email is required");
  }

  if (!actualPassword || Validation.isEmpty(actualPassword)) {
    throw new ApiErrors(401, "Password is required");
  }

  // Find active employee by email
  const employee = await Employee.findOne({
    where: { email: email.toLowerCase(), isActive: true },
  });

  if (!employee) {
    throw new ApiErrors(401, "Employee not found");
  }

  // Trim password to avoid extra spaces
  const cleanPassword = actualPassword.trim();

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(cleanPassword, employee.password);

  if (!isMatch) {
    throw new ApiErrors(401, "Incorrect password");
  }

  // Generate JWT tokens
  const { accessToken, refreshToken } = await generateEmployeeToken(employee.employeeId);

  if (!accessToken) {
    throw new ApiErrors(500, "Could not generate access token. Please try again");
  }

  // Update employee status and refresh token
  employee.refreshToken = refreshToken;
  employee.status = "available";
  await employee.save();

  // Fetch employee excluding sensitive fields
  const loggedInEmployee = await Employee.findByPk(employee.employeeId, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  };

  return res
    .status(200)
    .cookie("employeeAccessToken", accessToken, cookieOptions)
    .cookie("employeeRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, "Employee logged in Successfully", {
        employee: loggedInEmployee,
        accessToken,
        refreshToken,
      })
    );
});


const getEmployee = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    const role = req.user.role;

    if (!userId) {
        throw new ApiErrors(401, "Unauthorized Token");
    }

    if (!organizationId) {
        throw new ApiErrors(400, "Organization not selected");
    }

    if (role?.toLowerCase() !== "admin") {
        throw new ApiErrors(403, "Only admin can access this data");
    }

    const employees = await Employee.findAll({
        where: {
            organizationId,
            isActive: true
        },
        attributes: { exclude: ['password'] },
        order: [['employeeId', 'ASC']]
    });

    return res.status(200).json({
        message: "Employees fetched successfully",
        employees
    });
});


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

  if (!employeeId) {
    throw new ApiErrors(400, "Enter Employee Id you want to delete");
  }

  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only Admin can delete employees");
  }

  const organizationId = req.user.organizationId;

  // ---------- TRANSACTION ----------
  const t = await sequelize.transaction();

  try {
    const employee = await Employee.findOne({
      where: {
        employeeId,
        organizationId,
        isActive: true
      },
      transaction: t
    });

    if (!employee) {
      throw new ApiErrors(404, "Employee not found");
    }

    // ---------- IF DRIVER → FREE VEHICLE ----------
    if (employee.role === "driver") {
      await Vehicles.update(
        { driverId: null },
        {
          where: {
            driverId: employee.employeeId,
            organizationId
          },
          transaction: t
        }
      );
    }

    // ---------- SOFT DELETE EMPLOYEE ----------
    employee.isActive = false;
    employee.updatedBy = req.user.id;
    await employee.save({ transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Employee deleted and vehicle unassigned successfully"
    });

  } catch (error) {
    await t.rollback();
    throw error;
  }
});


const logoutEmployee = asyncHandler(async (req, res) => {

    if (!req.employee) {
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

    res.clearCookie("employeeAccessToken", options);
    res.clearCookie("employeeRefreshToken", options);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Employee logged out successfully"));
});


const changeStatus = asyncHandler(async(req, res) => {
    if (!req.employee) {
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


const updateEmployeeDetails = asyncHandler(async (req, res) => {
    if(!req.user) {
        throw new ApiErrors(400, "Unauthorized Request")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(400, "Only admin can update Employees Data")
    }

    const employee = await Employee.findByPk(req.params.id, {attributes: {exclude: ['password', 'refreshToken']}});

    if(!employee) {
        throw new ApiErrors(400, "Employee does not Exists")
    }

    if(employee.organizationId !== req.user.organizationId) {
        throw new ApiErrors(400, "Employee does not belongs to this Organization")
    }

    const allowedUpdate = [
        "email", "aadharNumber", "phone", "address", "panNumber",
        "employeeName"
    ];

    const updateData = {}

    allowedUpdate.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
    })

    updateData.updatedBy = req.user.id;

    await employee.update(updateData);

    return res.status(200).json({
        message: "Employee details updated Successfully",
        data: employee
    });
})


const countEmployee = asyncHandler(async(req, res) => {
    if(!req.user) {
        throw new ApiErrors(400, "Unauthorize Access")
    }

    if(req.user.role !== "admin") {
        throw new ApiErrors(401, "Only admin can access this data")
    }

    const organizationId = req.user.organizationId;

    if(!organizationId) {
        throw new ApiErrors(403, "User must be the part of the organization")
    }

    const employeeCount = await Employee.count({
        where: {
            organizationId: organizationId
        }
    });

    return res
    .status(200)
    .json({
        success: true,
        message: "Employee count fetched successfully",
        data: {
            organizationId,
            totalEmployees: employeeCount
        }
    });
})

const resetEmployeePassword = asyncHandler(async (req, res) => {
  const { employeeId, newPassword } = req.body;

  // ---------- AUTH ----------
  if (!req.user || req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can reset passwords");
  }

  // ---------- VALIDATION ----------
  if (!newPassword || newPassword.trim().length < 8) {
    throw new ApiErrors(400, "Password must be at least 8 characters");
  }

  const employee = await Employee.findByPk(employeeId);

  if (!employee) {
    throw new ApiErrors(404, "Employee not found");
  }

  // ---------- HASH ----------
  const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

  // ---------- UPDATE ----------
  employee.password = hashedPassword;
  employee.refreshToken = null; // invalidate sessions
  await employee.save();

  return res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });
});


export const getEmployeeBookings = async (req, res) => {
  try {
  
    const employeeId = req.employee.id;

    const bookings = await BookingCrew.findAll({
      where: { employeeId },
      include: [
        {
          model: Bookings,
          include: [
            { model: Vehicles },
            { model: PricingPlans }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      message: "Employee bookings fetched successfully",
      total: bookings.length,
      bookings
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};





export {
    createEmployee, 
    loginEmployee, 
    getEmployee, 
    fetchEmployeeById, 
    deleteEmployeeById, 
    logoutEmployee,
    changeStatus,
    updateEmployeeDetails,
    countEmployee,
    resetEmployeePassword
};