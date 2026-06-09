import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import { User } from "../models/user.model.js";
import APIresponse from "../utils/APIresponse.js";
import { Movie } from "../models/movie.model.js";
import jwt from "jsonwebtoken";
import { adminAuth, isConfigured } from "../config/firebase.js";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new APIerror(
            500,
            'Something went wrong while generating refresh and access token'
        )
    }
}



const registerUser = asyncHandler(async (req, res) => {

    const { name, email, username, password, phoneNumber, role } = req.body;

    if (
        [name, email, username, password, phoneNumber]
            .some(field => !String(field || "").trim())
    ) {
        throw new APIerror(400, "All fields are required");
    }

    if (!/^\d{10}$/.test(String(phoneNumber))) {
        throw new APIerror(400, "Invalid phone number");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new APIerror(400, "Invalid email");
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }, { phoneNumber }]
    });

    if (existingUser) {
        if (existingUser.email === email)
            throw new APIerror(409, "Email already exists");
        if (existingUser.username === username)
            throw new APIerror(409, "Username already exists");
        if (existingUser.phoneNumber === phoneNumber)
            throw new APIerror(409, "Phone number already exists");
    }

    // Only allow "user" or "admin", default to "user" if invalid value sent
    const allowedRoles = ["user", "admin"];
    const assignedRole = allowedRoles.includes(role) ? role : "user";

    const user = await User.create({
        name,
        email,
        username,
        password,
        phoneNumber: String(phoneNumber),
        role: assignedRole,
    })

    const createdUser = await User.findById(user._id);

    return res.status(201)
        .json(
            new APIresponse(
                201,
                createdUser,
                "User registered Successfully",
            )
        )

})



const loginUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!password || (!username && !email)) {
        throw new APIerror(400, "Credentials required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    }).select("+password")

    if (!user) {
        throw new APIerror(404, 'user does not exist')
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new APIerror(401, 'Invalid user credentials')
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

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

const logoutUser = asyncHandler(async (req, res) => {
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

const firebaseAuth = asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        throw new APIerror(400, "Firebase ID token is required");
    }

    if (!isConfigured) {
         throw new APIerror(500, "Firebase Admin is not configured on the server.");
    }

    let decodedToken;
    try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
        console.error("Firebase token verification error:", error);
        throw new APIerror(401, "Invalid Firebase token");
    }

    const { uid, email, phone_number, name } = decodedToken;

    // Check if user exists
    let user = await User.findOne({
        $or: [
            { firebaseUid: uid },
            email ? { email } : null,
            phone_number ? { phoneNumber: phone_number } : null
        ].filter(Boolean)
    });

    if (user) {
        if (!user.firebaseUid) {
            user.firebaseUid = uid;
            user.authProvider = email ? "google" : "phone";
            if (!user.phoneNumber && phone_number) user.phoneNumber = phone_number;
            await user.save({ validateBeforeSave: false });
        }
    } else {
        const newUserEmail = email || `${uid}@phone.bookmovishow.com`;
        const newUserPhone = phone_number || undefined;
        const newUserName = name || (email ? email.split("@")[0] : `user_${uid.substring(0, 5)}`);
        const newUserUsername = `${newUserName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}_${Date.now().toString().slice(-4)}`;

        user = await User.create({
            name: newUserName,
            email: newUserEmail,
            username: newUserUsername,
            phoneNumber: newUserPhone,
            firebaseUid: uid,
            authProvider: email ? "google" : "phone",
            role: "user"
        });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id);

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new APIresponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "Authentication successful"
            )
        );
});



const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new APIerror(401, 'unauthorized request')
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new APIerror(401, 'Invalid refresh token')
        }

        if (incomingRefreshToken !== user.refreshToken) {
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
    catch (error) {
        throw new APIerror(401, error?.message || "Invalid refresh token")
    }

})



const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id).select("+password");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new APIerror(400, 'Invalid old password')
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new APIresponse(
                200,
                {},
                "Password changed successfully"
            )
        )

})



const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new APIresponse(
            200,
            req.user,
            "current user fetched successfully"
        )
    );
})



const updateAccountDetails = asyncHandler(async (req, res) => {

    const updateFields = {};

    ["username", "name", "email", "phoneNumber"].forEach(field => {
        if (req.body[field]) updateFields[field] = req.body[field];
    });

    const UpdateUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFields
        },
        {
            new: true,
        },
    )

    return res.status(200)
        .json(
            new APIresponse(
                200,
                UpdateUser,
                "Account details updated successfully"
            )
        )
})


const toggleFavoriteMovie = asyncHandler(async (req, res) => {

    const { movieId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return res.status(400).json(
            new APIresponse(400, null, "Invalid movie ID")
        );
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
        return res.status(404).json(
            new APIresponse(404, null, "Movie not found")
        );
    }

    const user = await User.findById(userId);

    const isFavorite = user.favoriteMovies.includes(movieId);

    if (isFavorite) {
        user.favoriteMovies.pull(movieId);
        await user.save();
        return res.status(200).json(
            new APIresponse(
                200,
                { isFavorite: false },
                "Movie removed from favorites"
            )
        );
    }

    user.favoriteMovies.push(movieId);
    await user.save();

    return res.status(200).json(
        new APIresponse(
            200,
            { isFavorite: true },
            "Movie added to favorites"
        )
    );
})

const getFavoriteMovies = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate("favoriteMovies");

    return res.status(200).json(
        new APIresponse(
            200,
            user.favoriteMovies,
            user.favoriteMovies.length
                ? "Favorite movies fetched"
                : "No favorite movies"
        )
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    changeCurrentPassword,
    updateAccountDetails,
    toggleFavoriteMovie,
    getFavoriteMovies,
    firebaseAuth,
}