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

    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true,
    },

    seats: [
        {
            seatNumber: {
                type: String,
                required: true,
                trim: true,
                uppercase: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0,
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
        enum: ["PENDING", "CONFIRMED", "FAILED", "EXPIRED", "CANCELLED"],
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

    screenNo: {
        type: Number,
        required: true,
    },

    showTime: {
        type: String,
        required: true,
    },

    showDate: {
        type: String,
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

bookingSchema.index({
    movieId: 1,
    theatreId: 1,
    bookingStatus: 1,
});

bookingSchema.index({ userId: 1, createdAt: -1 });

export const Booking = mongoose.model("Booking", bookingSchema);
