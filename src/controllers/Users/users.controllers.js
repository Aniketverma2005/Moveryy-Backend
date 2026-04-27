import {asyncHandler} from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";  
import { Validation } from "../../utils/Validation.js";
import User from "../../models/Users/Users.js";
import PendingUser from "../../models/PendingUsers.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { generateTokenWithOrg } from "../../utils/GenerateTokenWithOrg.js";
import jwt from "jsonwebtoken";
import Organizations from "../../models/Organizations.js";
import { generateOTP, sendOTPEmail } from "../../utils/OTPService.js";
import { Op } from "sequelize";



//Generate JWT token
const generateAccessToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if(!user) {throw new ApiErrors(401, "User not found")}

        const accessToken = await user.jwtGenerateToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        
        return {accessToken, refreshToken};
        
    } catch (error) {
        throw new ApiErrors(500, "Could not generate access token");
    }
}


//Register User
const registerUser = asyncHandler (async (req, res) => {
    console.log('🔥 NEW REGISTRATION CODE IS RUNNING - Using PendingUser table');
    const {firstName, lastName, email, phone, password, role} = req.body

    // Validation
    if(Validation.isEmpty(firstName)) {
        throw new ApiErrors(400, "First name is required");
    }

    if(Validation.isEmpty(lastName)) {
        throw new ApiErrors(400, "Last name is required");
    }

    if(Validation.isEmpty(email) || !Validation.validateEmail(email)) {
        throw new ApiErrors(400, "A valid email is required");
    }

    if(Validation.isEmpty(phone) || !Validation.validatePhone(phone)) {
        throw new ApiErrors(400, "A valid phone number is required");
    }

    if(Validation.isEmpty(password) || password.length < 8) {
        throw new ApiErrors(400, "Password must be at least 8 characters long");
    } 

    if(Validation.isEmpty(role) || !["user", "admin", "transport"].includes(role)) {
        throw new ApiErrors(400, "Role must be one of: user, admin or transport");
    }

    // Check if user already exists in main users table
    const existingUser = await User.findOne({where: {email}});
    if(existingUser) {
        throw new ApiErrors(409, "User with this email already exists");
    }

    // Check if user already exists in pending users table
    const existingPendingUser = await PendingUser.findOne({where: {email}});
    if(existingPendingUser) {
        // Delete old pending registration
        await existingPendingUser.destroy();
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

    try {
        // First, try to send email
        await sendOTPEmail(email, otp, firstName);

        // If email succeeds, then store in pending users table
        const pendingUser = await PendingUser.create({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            email,
            phone,
            password,
            role,
            emailOTP: otp,
            emailOTPExpires: otpExpires
        });

        res.status(201).json(
            new ApiResponse(200, 
                { 
                    email,
                    message: "Registration successful! Please check your email for OTP verification."
                }, 
                "OTP sent to your email"
            )
        );

    } catch (error) {
        // If email fails, don't store anything
        throw new ApiErrors(500, `Failed to send OTP email: ${error.message}`);
    }
})


//Login User using email and password
// Login User using email and password
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // --- Validation ---
    if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
        throw new ApiErrors(400, "A valid email is required");
    }

    if (Validation.isEmpty(password)) {
        throw new ApiErrors(400, "Password is required");
    }

    // --- Fetch user ---
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    // --- Check if email is verified ---
    // Accept both 1 (integer) and true (boolean)
    if (user.emailVerified !== 1 && user.emailVerified !== true) {
        throw new ApiErrors(401, "Please verify your email first. Check your inbox for OTP.");
    }

    const validPassword = await user.isPasswordCorrect(password);
    if (!validPassword) {
        throw new ApiErrors(401, "Incorrect password");
    }

    // --- Default variables ---
    let accessToken = null;
    let refreshToken = null;
    let activeOrganization = null;
    let totalOrganization = null;
    let organizations = [];

    // --- Handle admin organization logic ---
    if (user.role === "admin") {
        organizations = await Organizations.findAll({ where: { userId: user.id } });
        const orgCount = organizations.length;

        if (orgCount === 0) {
            // --- Case: Admin has no organization ---
            totalOrganization = "NO_ORG";

            // Generate temporary token (no org context)
            const tokens = await generateAccessToken(user.id);
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        } 
        else if (orgCount === 1) {
            // --- Case: Admin has exactly one organization ---
            totalOrganization = "SINGLE_ORG";
            activeOrganization = organizations[0];

            // Ensure organization is active
            if (activeOrganization.status !== "active") {
                activeOrganization.status = "active";
                await activeOrganization.save();
            }

            // Generate token with org context
            const tokens = await generateTokenWithOrg(
                user.id,
                activeOrganization.organizationId
            );
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        } 
        else {
            // --- Case: Admin has multiple organizations ---
            totalOrganization = "MULTI_ORG";

            // Deactivate all orgs (admin must select one in UI)
            await Organizations.update(
                { status: "inactive" },
                { where: { userId: user.id } }
            );

            // Generate token (no active org context yet)
            const tokens = await generateAccessToken(user.id);
            accessToken = tokens.accessToken;
            refreshToken = tokens.refreshToken;
        }
    } 
    else {
        // --- Normal user login ---
        const tokens = await generateAccessToken(user.id);
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
    }

    // --- Safety check ---
    if (!accessToken) {
        throw new ApiErrors(500, "Could not generate access token. Please try again");
    }

    // --- Remove sensitive data ---
    const loggedInUser = await User.findByPk(user.id, {
        attributes: { exclude: ["password", "refreshToken"] },
    });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    // --- Determine if admin needs to create org ---
    const needsOrganizationSetup = totalOrganization === "NO_ORG";

    // --- Final response ---
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    activeOrganization: activeOrganization
                        ? {
                              organizationId: activeOrganization.organizationId,
                              name: activeOrganization.organizationName,
                              status: activeOrganization.status,
                          }
                        : null,
                    organizationStatus: totalOrganization, // NO_ORG, SINGLE_ORG, MULTI_ORG
                    needsOrganizationSetup,               // true if admin has no org
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});




//Logout user
const logoutUser = asyncHandler(async (req, res) => {

    await Organizations.update(
        {status: 'inactive'}, 
        {where: {userId: req.user.id, status: 'active'}});

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})


//Refresh Access and Refresh Tokens
const refreshAccessToken = asyncHandler(async(req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken) {
        new ApiErrors(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            const user = await User.findByPk(decodedToken?.id)
    
            if(!user) {
                throw new ApiErrors(401, "Invalid refresh token");
            }
    
            if(user?.refreshToken !== incommingRefreshToken) {
                throw new ApiErrors(401, "Refresh token Expired. Please login again");
            }
    
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            }
    
            const {accessToken, newRefreshToken} = await generateAccessToken(user.id);
    
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, 
                {accessToken, newRefreshToken }, "Access token refreshed successfully"))
        });
    } catch (error) {
        throw new ApiErrors(401, error?.message || "Invalid refresh token. Please login again");
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (Validation.isEmpty(oldPassword)) {
        throw new ApiErrors(400, "Old password is required");
    }

    if (Validation.isEmpty(newPassword) || newPassword.length < 8) {
        throw new ApiErrors(400, "New password must be at least 8 characters long");
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordCorrect) {
        throw new ApiErrors(401, "Old password is incorrect");
    }

    

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
})


const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id, {attributes: {exclude: ['password', 'refreshToken']}});
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
})


const updateUserFirstName = asyncHandler(async (req, res) => {
    const { firstName } = req.body;

    if (Validation.isEmpty(firstName)) {
        throw new ApiErrors(400, "First name is required");
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    user.firstName = firstName.toLowerCase();
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(new ApiResponse(200, user, "First Name Updated Successfully"))
})


const updateUserLastName = asyncHandler(async (req, res) => {
    const { lastName } = req.body;

    if (Validation.isEmpty(lastName)) {
        throw new ApiErrors(400, "Last name is required");
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    user.lastName = lastName.toLowerCase();
    await user.save({validateBeforeSave: false});

    return res.status(200)
    .json(new ApiResponse(200, user, "Last Name Updated successfully"))
})


// Verify OTP
const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "Valid email is required");
  }

  if (Validation.isEmpty(otp) || otp.length !== 6) {
    throw new ApiErrors(400, "Valid 6-digit OTP is required");
  }

  // Find pending user with valid OTP
  const pendingUser = await PendingUser.findOne({ 
    where: { 
      email,
      emailOTP: otp,
      emailOTPExpires: { [Op.gt]: new Date() }
    } 
  });

  if (!pendingUser) {
    throw new ApiErrors(400, "Invalid or expired OTP");
  }

  try {
    // Create user in main users table using raw insert to ensure emailVerified is set
    const [userId] = await User.sequelize.query(
      `INSERT INTO users (firstName, lastName, email, phone, password, role, emailVerified, emailOTP, emailOTPExpires, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, 1, NULL, NULL, NOW(), NOW())`,
      {
        replacements: [
          pendingUser.firstName,
          pendingUser.lastName,
          pendingUser.email,
          pendingUser.phone,
          pendingUser.password,
          pendingUser.role
        ]
      }
    );

    // Delete from pending users table
    await pendingUser.destroy();

    res.status(200).json(
      new ApiResponse(200, 
        { 
          userId: userId,
          email: pendingUser.email 
        }, 
        "Email verified successfully! You can now login."
      )
    );

  } catch (error) {
    throw new ApiErrors(500, `Failed to create user: ${error.message}`);
  }
});

// Resend OTP
const resendEmailOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "Valid email is required");
  }

  // Check if user already exists in main table
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiErrors(400, "User already exists and is verified");
  }

  // Find pending user
  const pendingUser = await PendingUser.findOne({ where: { email } });
  if (!pendingUser) {
    throw new ApiErrors(404, "No pending registration found for this email");
  }

  // Generate new OTP
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

  try {
    // First, try to send email
    await sendOTPEmail(email, otp, pendingUser.firstName);

    // If email succeeds, update pending user
    pendingUser.emailOTP = otp;
    pendingUser.emailOTPExpires = otpExpires;
    await pendingUser.save();

    res.status(200).json(
      new ApiResponse(200, {}, "OTP sent to your email")
    );

  } catch (error) {
    throw new ApiErrors(500, `Failed to send OTP email: ${error.message}`);
  }
});







export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserFirstName, updateUserLastName, verifyEmailOTP, resendEmailOTP};