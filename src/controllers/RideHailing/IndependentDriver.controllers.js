import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Validation } from "../../utils/Validation.js";
import IndependentDriver from "../../models/RideHailing/IndependentDriver.js";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail } from "../../utils/OTPService.js";

// Temporary in-memory store for pending OTPs (new drivers only)
// Key: email, Value: { otp, otpExpiry }
const pendingDriverOTPs = new Map();

// ─────────────────────────────────────────────
// STEP 1: Send OTP (Register if new, Login if existing)
// ─────────────────────────────────────────────
export const sendDriverOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || !Validation.validateEmail(email)) {
    throw new ApiErrors(400, "A valid email is required");
  }

  const normalizedEmail = email.toLowerCase();

  // Check if driver already exists in DB
  const existingDriver = await IndependentDriver.findOne({ where: { email: normalizedEmail } });

  const isNewDriver = !existingDriver;

  // Generate OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + (process.env.OTP_EXPIRY_MINUTES || 5) * 60 * 1000);

  if (isNewDriver) {
    // NEW DRIVER: Store OTP in memory only - DO NOT create DB record yet
    pendingDriverOTPs.set(normalizedEmail, { otp, otpExpiry });
  } else {
    // EXISTING DRIVER: Update OTP in DB for login
    await existingDriver.update({
      emailOTP: otp,
      emailOTPExpires: otpExpiry,
    });
  }

  // Send OTP email asynchronously
  sendOTPEmail(normalizedEmail, otp, existingDriver?.fullName || 'Driver').catch(err => {
    console.error('Failed to send driver OTP email:', err);
  });

  return res.status(200).json(
    new ApiResponse(200, {
      email: normalizedEmail,
      isNewDriver,
      message: isNewDriver
        ? `OTP sent! Please verify to complete registration. This OTP is valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes only.`
        : `OTP sent! Please verify to login. This OTP is valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes only.`
    }, "OTP sent to your email")
  );
});

// ─────────────────────────────────────────────
// STEP 2: Verify OTP (Complete Register or Login)
// ─────────────────────────────────────────────
export const verifyDriverOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiErrors(400, "Email and OTP are required");
  }

  const normalizedEmail = email.toLowerCase();

  // Check if this is a new driver (OTP in memory) or existing (OTP in DB)
  const pendingOTP = pendingDriverOTPs.get(normalizedEmail);
  let driver = await IndependentDriver.findOne({ where: { email: normalizedEmail } });

  if (!driver && !pendingOTP) {
    throw new ApiErrors(404, "No OTP request found. Please request a new OTP.");
  }

  if (pendingOTP) {
    // ── NEW DRIVER FLOW ──

    // Check OTP expiry
    if (new Date() > new Date(pendingOTP.otpExpiry)) {
      pendingDriverOTPs.delete(normalizedEmail); // Clean up expired OTP
      throw new ApiErrors(400, "OTP has expired. Please request a new OTP.");
    }

    // Verify OTP
    if (pendingOTP.otp !== otp) {
      throw new ApiErrors(400, "Invalid OTP");
    }

    // OTP verified - NOW create driver in DB for the first time
    driver = await IndependentDriver.create({
      email: normalizedEmail,
      emailVerified: true,
      status: 'pending',
    });

    // Clean up memory
    pendingDriverOTPs.delete(normalizedEmail);

  } else {
    // ── EXISTING DRIVER FLOW ──

    // Check OTP exists
    if (!driver.emailOTP) {
      throw new ApiErrors(400, "No OTP found. Please request a new OTP.");
    }

    // Check OTP expiry
    if (new Date() > new Date(driver.emailOTPExpires)) {
      throw new ApiErrors(400, "OTP has expired. Please request a new OTP.");
    }

    // Verify OTP
    if (driver.emailOTP !== otp) {
      throw new ApiErrors(400, "Invalid OTP");
    }

    // Clear OTP and mark email as verified
    await driver.update({
      emailOTP: null,
      emailOTPExpires: null,
      emailVerified: true,
    });
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { driverId: driver.driverId, email: driver.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "1d" }
  );

  const refreshToken = jwt.sign(
    { driverId: driver.driverId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
  );

  // Save refresh token
  await driver.update({ refreshToken });

  // Cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  // Check if profile is complete
  const isProfileComplete = !!(driver.fullName && driver.phone);

  return res
    .status(200)
    .cookie("driverAccessToken", accessToken, cookieOptions)
    .cookie("driverRefreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, {
        driver: {
          driverId: driver.driverId,
          email: driver.email,
          fullName: driver.fullName,
          phone: driver.phone,
          status: driver.status,
          isProfileComplete,
        },
        accessToken,
        refreshToken,
        nextStep: isProfileComplete ? "dashboard" : "complete_profile",
      }, "OTP verified successfully")
    );
});
