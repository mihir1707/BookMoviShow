import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
// console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);


const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,  // removes whitespace
        index: true, // Creates a database index on this field to make searching faster.
    },
    name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    refreshToken: {
        type: String,
        select: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    favoriteMovies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
        }
    ],

},{timestamps: true})


// Hash password
userSchema.pre('save', async function () {
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10)
})


// Check password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


// Access token
userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is missing in .env");
    }
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}


// Refresh token
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("REFRESH_TOKEN_SECRET is missing in .env");
    }
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}



export const User = mongoose.model('User', userSchema)