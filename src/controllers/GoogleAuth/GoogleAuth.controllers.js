import { verifyGoogleToken } from "../../utils/GoogleAuth.js";
import Users from "../../models/Users/Users.js";
import { generateTokenWithOrg } from "../../utils/GenerateTokenWithOrg.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiErrors } from "../../utils/ApiErrors.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Op } from "sequelize";


// Google Sign-Up
export const googleSignup = asyncHandler(async (req, res) => {
  const { googleToken, role } = req.body;

  // Validate inputs
  if (!googleToken || !role) {
    throw new ApiError(400, 'Google token and role are required');
  }

  if (!['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Role must be either "user" or "admin"');
  }

  // Verify Google token
  const googleUser = await verifyGoogleToken(googleToken);

  // Check if user already exists
  const existingUser = await Users.findOne({
    where: { email: googleUser.email }
  });

  if (existingUser) {
    throw new ApiError(409, 'Email already registered. Please login instead.');
  }

  // Create new user
  const newUser = await Users.create({
    firstName: googleUser.firstName,
    lastName: googleUser.lastName,
    email: googleUser.email,
    role: role,
    googleId: googleUser.googleId,
    authProvider: 'google',
    profilePicture: googleUser.profilePicture,
    emailVerified: 1,
    password: null
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenWithOrg(newUser.id);

  // Update refresh token in database
  await newUser.update({ refreshToken });

  // Remove sensitive data
  const userResponse = {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    role: newUser.role,
    profilePicture: newUser.profilePicture,
    authProvider: newUser.authProvider
  };

  return res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      accessToken,
      refreshToken
    }, 'Google sign-up successful')
  );
});
