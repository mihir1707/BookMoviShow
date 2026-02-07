import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Booking } from '../models/booking.model.js'


const createPayment = asyncHandler(async (req, res) => {

    const { bookingId, paymentMethod } = req.body

    if (!req.user || !req.user._id) {
        return res.status(401).json(
            new APIresponse(401, {}, "Unauthorized")
        );
    }

    if (!bookingId || !paymentMethod) {
        return res.status(400)
            .json(
                new APIresponse(
                    400,
                    {},
                    "BookingId and payment method are required",
                )
            )
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json(
            new APIresponse(404, {}, "Booking not found")
        );
    }

    if (!booking.userId || booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json(
            new APIresponse(403, {}, "Unauthorized payment attempt")
        );
    }

    const existingPayment = await Payment.findOne({
        bookingId,
        status: { $in: ["CREATED", "SUCCESS"] },
    });

    if (existingPayment) {
        return res.status(409).json(
            new APIresponse(409, null, "Payment already exists for this booking")
        );
    }

    const payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount,
        currency: "INR",
        paymentMethod,
        status: "CREATED",
        gateway: "RAZORPAY",
    })

    return res.status(201).json(
        new APIresponse(
            201,
            payment,
            "Payment created successfully"
        )
    );
})


const getPaymentById = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!req.user || !req.user._id) {
        return res.status(401).json(
            new APIresponse(401, {}, "Unauthorized")
        );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            new APIresponse(400, null, "Invalid payment ID")
        );
    }


    const payment = await Payment.findById(id).populate({
        path: "bookingId",
        select: "seats totalAmount status createdAt userId",
    });

    if (!payment) {
        return res.status(404).json(
            new APIresponse(
                404,
                {},
                "Payment not found"
            )
        );
    }

    if (
        !payment.bookingId ||
        payment.bookingId.userId.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json(
            new APIresponse(403, null, "Unauthorized access")
        );
    }

    return res.status(200).json(
        new APIresponse(
            200,
            payment,
            "Payment fetched successfully"
        )
    );
})


const getMyPayments = asyncHandler(async (req, res) => {

    if (!req.user || !req.user._id) {
        return res.status(401).json(
            new APIresponse(401, {}, "Unauthorized")
        );
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
        .populate({
            path: "bookingId",
            match: { userId: req.user._id },
            select: "seats totalAmount status createdAt",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


    const userPayments = payments.filter(p => p.bookingId);

    return res.status(200).json(
        new APIresponse(
            200,
            {
                page,
                limit,
                payments: userPayments,
            },
            "User payments fetched successfully"
        )
    );
});



export {
    createPayment,
    getPaymentById,
    getMyPayments,
}