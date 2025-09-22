import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";  
import { Validation } from "../utils/Validation.js";
import User from "../models/users.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//Generate JWT token
const generateAccessToken = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        if(!user) {throw new ApiErrors(401, "User not found")}

        const accessToken = await user.jwtGenerateToken();
        
        return {accessToken};
        
    } catch (error) {
        throw new ApiErrors(500, "Could not generate access token");
    }
}

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


    const { accessToken } = await generateAccessToken(user.id);
    if(!accessToken) {
        throw new ApiErrors(500, "Could not generate access token. Please try again");
    }

    const loggedInUser = await User.findByPk(user.id, {attributes: {exclude: ['password']}});

    return res
    .status(200)
    .cookie("accessToken", accessToken)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken
            }
            , "User logged in Successfully"
        )
    )

})


//Logout user
const logoutUser = asyncHandler(async (req, res) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" 
    });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})


export {registerUser, loginUser, logoutUser}