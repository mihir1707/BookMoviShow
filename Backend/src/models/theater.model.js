import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true,
        index: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    screensCount: {
        type: Number,
        required: true,
        min: 1,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdById: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },

},{timestamps: true})

theaterSchema.index({ name: 1, cityId: 1 }, { unique: true });

export const Theater = mongoose.model("Theater", theaterSchema)