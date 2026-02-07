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
        min: 1,
    },

    currency: {
        type: String,
        default: "INR",
    },

    razorpayOrderId: {
        type: String,
        index: true,
    },

    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true,
    },

    razorpaySignature: {
        type: String,
    },

    gatewayOrderId: {
        type: String,
        index: true,
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "CARD", "NET_BANKING"],
        required: true,
    },

    status: {
        type: String,
        enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED"],
        default: "CREATED",
        index: true,
    },

    failureReason: {
        type: String,
    },

    refunds: [{
        refundId: String,
        amount: Number,
        status: String,
        createdAt: Date,
    }],


    transactionId: {
        type: String,
        unique: true,
        sparse: true,
    },

    gateway: {
        type: String,
        default: "RAZORPAY",
    },

}, { timestamps: true, }
);

export const Payment = mongoose.model("Payment", paymentSchema);
