import crypto from "crypto";
import { razorpay } from "../config/razorpay.js";
import { Payment } from "../models/payment.model.js";
import { Booking } from "../models/booking.model.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
        bookingStatus: "PENDING",
        expiresAt: { $gt: new Date() },
    });

    if (!booking) {
        throw new APIerror(404, "Booking not found or expired");
    }

    let payment = await Payment.findOne({
        bookingId,
        status: { $in: ["CREATED", "SUCCESS"] },
    });

    if (payment && payment.status === "SUCCESS") {
        throw new APIerror(409, "Payment already completed");
    }

    if (!payment) {
        payment = await Payment.create({
            bookingId,
            amount: booking.totalAmount,
            currency: "INR",
            paymentMethod: "razorpay",
            status: "CREATED",
            gateway: "RAZORPAY",
        });
    }

    const order = await razorpay.orders.create({
        amount: booking.totalAmount * 100,
        currency: "INR",
        receipt: `booking_${booking._id}`,
    });

    payment.razorpayOrderId = order.id;
    await payment.save();

    return res.status(200).json(
        new APIresponse(
            200,
            {
                key: process.env.RAZORPAY_KEY_ID,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            "Razorpay order created"
        )
    );
})

const verifyRazorpayPayment = asyncHandler(async (req, res) => {
    const {
        bookingId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const payment = await Payment.findOne({
        bookingId,
        razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
        throw new APIerror(404, "Payment record not found");
    }

    if (payment.status === "SUCCESS") {
        return res.status(200).json(
            new APIresponse(200, {}, "Payment already verified")
        );
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
    });

    if (!booking) {
        throw new APIerror(404, "Booking not found");
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        throw new APIerror(400, "Invalid Razorpay signature");
    }

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    booking.bookingStatus = "CONFIRMED";
    booking.paymentId = payment._id;
    booking.expiresAt = null;
    await booking.save();

    return res.status(200).json(
        new APIresponse(
            200,
            booking,
            "Payment verified and booking confirmed"
        )
    );
})

export {
    createRazorpayOrder,
    verifyRazorpayPayment,
}