import mongoose from "mongoose";


const seatAvailabilitySchema = new mongoose.Schema({

    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
        index: true,
    },
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "LOCKED", "BOOKED"],
        default: "AVAILABLE",
        index: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
    },
    lockedUntil: {
        type: Date,
        default: null,
    },

},{timestamps: true})

seatAvailabilitySchema.index(
    { showId: 1, seatId: 1 },
    { unique: true }
);

export const SeatAvailability = mongoose.model("SeatAvailability", seatAvailabilitySchema)