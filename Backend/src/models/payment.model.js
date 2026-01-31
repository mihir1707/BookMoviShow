import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
        index: true,
    },

    amount: {
        type: Number,
        required: true,
        min: 0,
    },

    currency: {
        type: String,
        default: "INR",
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "CARD", "NET_BANKING", "WALLET"],
        required: true,
    },

    status: {
        type: String,
        enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED"],
        default: "CREATED",
        index: true,
    },

    transactionId: {
        type: String,
        unique: true,
        sparse: true,
    },

    gateway: {
        type: String,
        default: "RAZORPAY",
    },

},{ timestamps: true, }
);

export const Payment = mongoose.model("Payment", paymentSchema);
