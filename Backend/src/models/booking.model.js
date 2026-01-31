import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },

    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
        index: true,
    },

    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true,
    },

    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
    },

    seats: [
        {
            seatId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat",
                required: true,
            },
            seatNumber: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],

    seatCount: {
        type: Number,
        required: true,
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    bookingStatus: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "FAILED"],
        default: "PENDING",
        index: true,
    },

    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },

    bookingCode: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },

    expiresAt: {
        type: Date,
        default: null,
        index: true,
    },
},
{ timestamps: true, }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
