import { asyncHandler } from "../../utils/asyncHandler.js";
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


// Generate JWT token
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user) { throw new ApiErrors(401, "User not found"); }

    const accessToken = await user.jwtGenerateToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Could not generate access token");
  }
};


// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  if (Validation.isEmpty(firstName)) throw new ApiErrors(400, "First name is required");
  if (Validation.isEmpty(lastName)) throw new ApiErrors(400, "Last name is required");
  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) throw new ApiErrors(400, "A valid email is required");
  if (Validation.isEmpty(phone) || !Validation.validatePhone(phone)) throw new ApiErrors(400, "A valid phone number is required");
  if (Validation.isEmpty(password) || password.length < 8) throw new ApiErrors(400, "Password must be at least 8 characters long");
  if (Validation.isEmpty(role) || !["user", "admin", "transport"].includes(role)) throw new ApiErrors(400, "Role must be one of: user, admin or transport");

  // Check main users table
  const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
  if (existingUser) {
    if (existingUser.email === email) throw new ApiErrors(409, "User with this email already exists");
    if (existingUser.phone === phone) throw new ApiErrors(409, "User with this phone number already exists");
  }

  // Check pending users table — delete old entry if exists
  const existingPendingUser = await PendingUser.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
  if (existingPendingUser) await existingPendingUser.destroy();

  // Generate OTP and store in pending_users
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

  await PendingUser.create({
    firstName: firstName.toLowerCase(),
    lastName: lastName.toLowerCase(),
    email,
    phone,
    password,
    role,
    emailOTP: otp,
    emailOTPExpires: otpExpires
  });

  // Send OTP email async
  sendOTPEmail(email, otp, firstName).catch(error => {
    console.error('Failed to send OTP email:', error.message);
  });

  res.status(201).json(
    new ApiResponse(200, { email }, "OTP sent to your email. Please verify to complete registration.")
  );
});


// Login User using email and password
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) throw new ApiErrors(400, "A valid email is required");
  if (Validation.isEmpty(password)) throw new ApiErrors(400, "Password is required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiErrors(404, "User not found");

  if (user.emailVerified !== 1 && user.emailVerified !== true) {
    throw new ApiErrors(401, "Please verify your email first. Check your inbox for OTP.");
  }

  const validPassword = await user.isPasswordCorrect(password);
  if (!validPassword) throw new ApiErrors(401, "Incorrect password");

  let accessToken = null;
  let refreshToken = null;
  let activeOrganization = null;
  let totalOrganization = null;

  if (user.role === "admin") {
    const organizations = await Organizations.findAll({ where: { userId: user.id } });
    const orgCount = organizations.length;

    if (orgCount === 0) {
      totalOrganization = "NO_ORG";
      const tokens = await generateAccessToken(user.id);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } else if (orgCount === 1) {
      totalOrganization = "SINGLE_ORG";
      activeOrganization = organizations[0];
      if (activeOrganization.status !== "active") {
        activeOrganization.status = "active";
        await activeOrganization.save();
      }
      const tokens = await generateTokenWithOrg(user.id, activeOrganization.organizationId);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } else {
      totalOrganization = "MULTI_ORG";
      await Organizations.update({ status: "inactive" }, { where: { userId: user.id } });
      const tokens = await generateAccessToken(user.id);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    }
  } else {
    const tokens = await generateAccessToken(user.id);
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken) throw new ApiErrors(500, "Could not generate access token. Please try again");

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken", "emailOTP", "emailOTPExpires"] },
  });

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  const needsOrganizationSetup = totalOrganization === "NO_ORG";

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: loggedInUser,
      activeOrganization: activeOrganization ? {
        organizationId: activeOrganization.organizationId,
        name: activeOrganization.organizationName,
        status: activeOrganization.status,
      } : null,
      organizationStatus: totalOrganization,
      needsOrganizationSetup,
      accessToken,
      refreshToken,
    }, "User logged in successfully"));
});


// Send OTP for Login (Passwordless)
export const sendLoginOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "A valid email is required");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiErrors(404, "User not found. Please sign up first.");

  if (user.emailVerified !== 1 && user.emailVerified !== true) {
    throw new ApiErrors(400, "Email not verified. Please verify your email first.");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

  await user.update({ emailOTP: otp, emailOTPExpires: otpExpiry });

  sendOTPEmail(email, otp, user.firstName).catch(err => {
    console.error("Failed to send login OTP email:", err);
  });

  return res.status(200).json(new ApiResponse(200, { email }, "Login OTP sent to your email"));
});


// Verify OTP and Login (Passwordless)
export const verifyLoginOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) throw new ApiErrors(400, "A valid email is required");
  if (Validation.isEmpty(otp)) throw new ApiErrors(400, "OTP is required");

  const user = await User.findOne({ where: { email } });
  if (!user) throw new ApiErrors(404, "User not found");
  if (!user.emailOTP) throw new ApiErrors(400, "No OTP found. Please request a new OTP.");
  if (new Date() > new Date(user.emailOTPExpires)) throw new ApiErrors(400, "OTP has expired. Please request a new OTP.");
  if (user.emailOTP !== otp) throw new ApiErrors(400, "Invalid OTP");

  await user.update({ emailOTP: null, emailOTPExpires: null });

  let accessToken = null;
  let refreshToken = null;
  let activeOrganization = null;
  let totalOrganization = null;

  if (user.role === "admin") {
    const organizations = await Organizations.findAll({ where: { userId: user.id } });
    const orgCount = organizations.length;

    if (orgCount === 0) {
      totalOrganization = "NO_ORG";
      const tokens = await generateAccessToken(user.id);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } else if (orgCount === 1) {
      totalOrganization = "SINGLE_ORG";
      activeOrganization = organizations[0];
      if (activeOrganization.status !== "active") {
        activeOrganization.status = "active";
        await activeOrganization.save();
      }
      const tokens = await generateTokenWithOrg(user.id, activeOrganization.organizationId);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } else {
      totalOrganization = "MULTI_ORG";
      await Organizations.update({ status: "inactive" }, { where: { userId: user.id } });
      const tokens = await generateAccessToken(user.id);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    }
  } else {
    const tokens = await generateAccessToken(user.id);
    accessToken = tokens.accessToken;
    refreshToken = tokens.refreshToken;
  }

  if (!accessToken) throw new ApiErrors(500, "Could not generate access token. Please try again");

  const loggedInUser = await User.findByPk(user.id, {
    attributes: { exclude: ["password", "refreshToken", "emailOTP", "emailOTPExpires"] },
  });

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
  const needsOrganizationSetup = totalOrganization === "NO_ORG";

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {
      user: loggedInUser,
      activeOrganization: activeOrganization ? {
        organizationId: activeOrganization.organizationId,
        name: activeOrganization.organizationName,
        status: activeOrganization.status,
      } : null,
      organizationStatus: totalOrganization,
      needsOrganizationSetup,
      accessToken,
      refreshToken,
    }, "Login successful"));
});


// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  await Organizations.update({ status: "inactive" }, { where: { userId: req.user.id, status: "active" } });

  const options = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" };
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
});


// Refresh Access and Refresh Tokens
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) throw new ApiErrors(401, "Unauthorized Request");

  try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(decoded?.id);

    if (!user) throw new ApiErrors(401, "Invalid refresh token");
    if (user.refreshToken !== incomingRefreshToken) throw new ApiErrors(401, "Refresh token expired. Please login again");

    const options = { httpOnly: true, secure: process.env.NODE_ENV === "production" };
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessToken(user.id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, newRefreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiErrors(401, error?.message || "Invalid refresh token. Please login again");
  }
});


// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (Validation.isEmpty(oldPassword)) throw new ApiErrors(400, "Old password is required");
  if (Validation.isEmpty(newPassword) || newPassword.length < 8) throw new ApiErrors(400, "New password must be at least 8 characters long");

  const user = await User.findByPk(req.user.id);
  if (!user) throw new ApiErrors(404, "User not found");

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isOldPasswordCorrect) throw new ApiErrors(401, "Old password is incorrect");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});


// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password", "refreshToken"] } });
  if (!user) throw new ApiErrors(404, "User not found");

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});


// Update First Name
const updateUserFirstName = asyncHandler(async (req, res) => {
  const { firstName } = req.body;
  if (Validation.isEmpty(firstName)) throw new ApiErrors(400, "First name is required");

  const user = await User.findByPk(req.user.id);
  if (!user) throw new ApiErrors(404, "User not found");

  user.firstName = firstName.toLowerCase();
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, user, "First Name Updated Successfully"));
});


// Update Last Name
const updateUserLastName = asyncHandler(async (req, res) => {
  const { lastName } = req.body;
  if (Validation.isEmpty(lastName)) throw new ApiErrors(400, "Last name is required");

  const user = await User.findByPk(req.user.id);
  if (!user) throw new ApiErrors(404, "User not found");

  user.lastName = lastName.toLowerCase();
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, user, "Last Name Updated successfully"));
});


// Verify Email OTP (registration)
const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) throw new ApiErrors(400, "Valid email is required");
  if (Validation.isEmpty(otp) || otp.length !== 6) throw new ApiErrors(400, "Valid 6-digit OTP is required");

  const pendingUser = await PendingUser.findOne({
    where: { email, emailOTP: otp, emailOTPExpires: { [Op.gt]: new Date() } }
  });

  if (!pendingUser) throw new ApiErrors(400, "Invalid or expired OTP");

  try {
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

    await pendingUser.destroy();

    res.status(200).json(new ApiResponse(200, { userId, email: pendingUser.email }, "Email verified successfully! You can now login."));
  } catch (error) {
    throw new ApiErrors(500, `Failed to create user: ${error.message}`);
  }
});


// Resend Email OTP (registration)
const resendEmailOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (Validation.isEmpty(email) || !Validation.validateEmail(email)) throw new ApiErrors(400, "Valid email is required");

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw new ApiErrors(400, "User already exists and is verified");

  const pendingUser = await PendingUser.findOne({ where: { email } });
  if (!pendingUser) throw new ApiErrors(404, "No pending registration found for this email");

  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 10) * 60 * 1000);

  pendingUser.emailOTP = otp;
  pendingUser.emailOTPExpires = otpExpires;
  await pendingUser.save();

  sendOTPEmail(email, otp, pendingUser.firstName).catch(error => {
    console.error("Failed to resend OTP email:", error.message);
  });

  res.status(200).json(new ApiResponse(200, {}, "OTP sent to your email"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserFirstName,
  updateUserLastName,
  verifyEmailOTP,
  resendEmailOTP
};
