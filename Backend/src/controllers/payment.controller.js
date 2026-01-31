import { Payment } from "../models/payment.model.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Booking } from '../models/booking.model.js'


const createPayment = asyncHandler( async(req, res) => {

    const {bookingId, paymentMethod} = req.body

    if(!bookingId || !paymentMethod){
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

    if(!booking){
        return res.status(404).json(
            new APIresponse(404, {}, "Booking not found")
        );
    }

    if(booking.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json(
            new APIresponse(403, {}, "Unauthorized payment attempt")
        );
    }

    const existingPayment = await Payment.findOne({
        bookingId,
        status: { $in: ["CREATED", "SUCCESS"] },
    });

    if(existingPayment){
        return res.status(409).json(
            new APIresponse(409, null, "Payment already exists for this booking")
        );
    }

    const payment = await Payment.create({
        bookingId,
        amount: booking.totalAmount,
        paymentMethod,
        status: "CREATED"
    })

    return res.status(201).json(
        new APIresponse(
            201,
            payment,
            "Payment created successfully"
        )
    );
})


const getPaymentById = asyncHandler( async(req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json(
            new APIresponse(400, null, "Invalid payment ID")
        );
    }


    const payment = await Payment.findById(id)
        .populate({
            path: "bookingId",
            populate: [
                {
                    path: "showId",
                    populate: {
                        path: "movieId",
                        select: "title posterUrl",
                    },
                },
                {
                    path: "seatIds",
                    select: "seatNumber row",
                },
            ]
        })

    if(!payment){
        return res.status(404).json(
            new APIresponse(
                404,
                {},
                "Payment not found"
            )
        );
    }

    if(payment.bookingId.userId.toString() !== req.user._id.toString()) {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
        .populate({
            path: "bookingId",
            match: { userId: req.user._id },
            populate: [
                {
                    path: "showId",
                    populate: { path: "movieId", select: "title posterUrl" },
                },
                {
                    path: "seatIds",
                    select: "seatNumber row",
                },
            ],
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const filteredPayments = payments.filter(p => p.bookingId !== null);

    return res.status(200).json(
        new APIresponse(
            200,
            {
                page,
                limit,
                payments: filteredPayments,
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