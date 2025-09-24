import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";  
import { Validation } from "../utils/Validation.js";
import User from "../models/Users.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


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
    //get details from user
    //validation(not empty)
    //check if user already exists

    const {firstName, lastName, email, phone, password, role} = req.body

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

    const existingUser = await User.findOne({where: {email}});
    if(existingUser) {
        throw new ApiErrors(409, "User with this email already exists");
    }

    const user = await User.create({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        email,
        phone,
        password,
        role
    })

    //const createdUser = await User.findById(user.id, {attributes: {exclude: ['password']}});
    const createdUser = await User.findByPk(user.id, {attributes: {exclude: ['password']}});

    if(!createdUser) {
        throw new ApiErrors(500, "User registration failed. Please try again");
    }

    res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )  
})


//Login User using email and password
const loginUser = asyncHandler (async (req, res) => {
    const {email, password} = req.body;

    if(Validation.isEmpty(email) || !Validation.validateEmail(email)) {
        throw new ApiErrors(400, "A valid email is required");
    }

    if(Validation.isEmpty(password)) {
        throw new ApiErrors(400, "Password is required");
    }

    const user = await User.findOne({where: {email}});
    if(!user) {
        throw new ApiErrors(404, "User not found");
    }


    const validPassword = await user.isPasswordCorrect(password);
    if(!validPassword) {
        throw new ApiErrors(401, "Incorrect Password");
    }


    const { accessToken, refreshToken } = await generateAccessToken(user.id);
    if(!accessToken) {
        throw new ApiErrors(500, "Could not generate access token. Please try again");
    }

    const loggedInUser = await User.findByPk(user.id, {attributes: {exclude: ['password', 'refreshToken']}});

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
            {
                user: loggedInUser, accessToken, refreshToken
            }
            , "User logged in Successfully"
        )
    )

})


//Logout user
const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("accessToken", "refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" 
    });

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







export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUserFirstName, updateUserLastName};