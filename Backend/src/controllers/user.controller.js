import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import { User } from "../models/user.model.js";
import APIresponse from "../utils/APIresponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try{
        const user = await User.findById(userId)

        if(!user){
            throw new APIerror(404, "User not found while generate Tokens");
        }

        const accessToken = user.generateAccessToken()
        const refreshToken =  user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    }
    catch(error){
        throw new APIerror(500, 'Something went wrong while generating refresh and access token')
    }
}


const registerUser = asyncHandler( async(req, res) => {

    const {name, email, username, password, phonenumber, role='USER'} = req.body;
    // const name = req.body
    // console.log(name)

    if(
        [name, email, username, password, phonenumber].some((field)=>field?.trim()==="")
    ){
        throw new APIerror(400, 'All fields are required')
    }

    if(!/^\d{10}$/.test(String(phonenumber))) {
        throw new APIerror(400, "Invalid phone number");
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new APIerror(400, "Invalid email");
    }

    const checkUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(checkUser){
        throw new APIerror(400, 'User with email or username already exists')
    }

    const user = await User.create({
        name,
        email,
        username,
        password,
        phonenumber,
        role,
    })

    const createdUser = await User.findById(user._id)

    if(!createdUser){
        throw new APIerror(500, 'Something went wrong while registering the user')
    }

    return res.status(200)
    .json(
        new APIresponse(
            201,
            createdUser,
            "User registered Sucessfully",
        )
    )

})



const loginUser = asyncHandler( async(req, res) => {

    const {username, email, password} = req.body

    if(!password || (!username && !email)){
        throw new APIerror(400, "Credentials required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    }).select("+password")

    if(!user){
        throw new APIerror(404, 'user does not exist')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new APIerror(401, 'Invalid user credentials')
    } 

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new APIresponse(
            201,
            {
                user: loggedInUser, accessToken, refreshToken,
            },
            "User logged In Successfully",
        )
    )

})



const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new APIresponse(
            201,
            {},
            "User logged Out",
        )
    )

})



const refreshAccessToken = asyncHandler( async(req, res) => {

    const incomingRefreshToken = req.cookie?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new APIerror(401, 'unauthorized request')
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new APIerror(401, 'Invalid refresh token')
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new APIerror(401, 'Refresh Token is expire or used')
        }

        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new APIresponse(
                200,
                {
                    accessToken,
                    refreshToken: newRefreshToken
                },
                "Access token refreshed"
            )
        )

    }
    catch(error){
        throw new APIerror(401, error?.message || "Invalid refresh token")
    }

})



const changeCurrentPassword = asyncHandler( async(req, res) => {

    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user?._id).select("+password");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new APIerror(400, 'Invalid old password')
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(
        new APIresponse(
            200,
            {},
            "Password changed successfully"
        )
    )

})



const getCurrentUser = asyncHandler( async(req, res) => {
    return res.status(200)
    .json(
        200,
        req.user,
        "current user fetched successfully"
    )
})



const updateAccountDetails = asyncHandler( async(req, res) => {

    const updateFields = {};

    ["username", "name", "email", "phonenumber"].forEach(field => {
        if (req.body[field]) updateFields[field] = req.body[field];
    });

    const UpdateUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                updateFields,
            }
        },
        {
            new: true,
        },
    )

    return res.status(200)
    .json(
        new APIerror(
            200,
            UpdateUser,
            "Account details updated successfully"
        )
    )

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
}