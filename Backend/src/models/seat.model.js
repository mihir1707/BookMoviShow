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
        uppercase: true,
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
        index: true,
    },

},
{
    timestamps: true,
    collection: "seats",
})

seatSchema.index(
    { 
        screenId: 1, 
        row: 1, 
        seatNumber: 1 
    },
    { 
        unique: true 
    }
)

export const Seat = mongoose.model("Seat", seatSchema)