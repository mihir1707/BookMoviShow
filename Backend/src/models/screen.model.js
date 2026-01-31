import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({

    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    seatLayout: {
        type: Map,
            of: {
                rows: [String],
                seatsPerRow: Number,
                priceMultiplier: Number,
            },
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

},{timestamps: true})


export const Screen = mongoose.model("Screen", screenSchema)