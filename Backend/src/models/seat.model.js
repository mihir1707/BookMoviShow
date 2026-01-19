import mongoose from "mongoose";


const seatSchema = new mongoose.Schema({

    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
        index: true,
    },
    seatNumber: {
        type: String,
        required: true,
        trim: true,
    },
    row: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ["VIP", "GOLD", "SILVER", "REGULAR"],
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

},{timestamps: true})

seatSchema.index(
    { screenId: 1, seatNumber: 1 }, 
    { unique: true }
)

export const Seat = mongoose.model("Seat", seatSchema)