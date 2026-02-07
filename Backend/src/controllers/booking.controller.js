import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import { Booking } from "../models/booking.model.js";
import { Payment } from '../models/payment.model.js'
import crypto from "crypto";
import { console } from "inspector";

const LOCK_TIME = 10

const createBooking = asyncHandler(async (req, res) => {

    const { movieId, theatreId, screenNo, showTime, showDate, seats } = req.body;

    // console.log(movieId)

    if (!movieId || !theatreId) {
        throw new APIerror(400, "Movie and theatre are required");
    }

    if (!seats || seats.length === 0) {
        throw new APIerror(400, "No seats selected");
    }

    const seatNumbers = seats.map(seat => seat.seatNumber);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const conflict = await Booking.findOne({
            movieId,
            theatreId,
            screenNo,
            showTime,
            showDate,
            bookingStatus: {
                $in: ["PENDING", "CONFIRMED"]
            },
            "seats.seatNumber": { $in: seatNumbers },
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } },
            ],
        },
            null,
            { session }
        );

        if (conflict) {
            throw new APIerror(409, "One or more seats already booked");
        }

        const totalAmount = seats.reduce(
            (sum, seat) => sum + seat.price,
            0
        );

        const booking = await Booking.create(
            [{
                userId: req.user._id,
                movieId,
                theatreId,
                screenNo,
                showTime,
                showDate,
                seats,
                seatCount: seats.length,
                totalAmount,
                bookingStatus: "PENDING",
                bookingCode: `BMS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
                expiresAt: new Date(Date.now() + LOCK_TIME * 60 * 1000),
            }],
            { session }
        );


        await session.commitTransaction();

        res.status(201).json(
            new APIresponse(
                201,
                booking[0],
                "Booking created successfully"
            )
        );
    }
    catch (error) {
        await session.abortTransaction();
        console.log("error when createBooking")
        throw error;
    }
    finally {
        session.endSession();
    }

})


const lockedSeat = asyncHandler(async (req, res) => {

    const { movieId, theatreId, screenNo, showTime, showDate } = req.query;

    if (!movieId || !theatreId || !screenNo || !showTime || !showDate) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    const bookings = await Booking.find({
        movieId,
        theatreId,
        screenNo,
        showTime,
        showDate,
        bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
        $or: [
            { expiresAt: null },
            { expiresAt: { $gt: new Date() } }
        ]
    }).select("seats");

    const lockedSeats = bookings.flatMap(booking =>
        booking.seats.map(seat => seat.seatNumber)
    );

    return res.status(200).json(
        new APIresponse(200, lockedSeats, "Locked seats fetched successfully")
    );

})


const confirmBooking = asyncHandler(async (req, res) => {

    const { bookingId, paymentId } = req.body

    if (!bookingId || !paymentId) {
        throw new APIerror(400, "bookingId and paymentId are required");
    }

    const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
        bookingStatus: "PENDING",
        expiresAt: { $gt: new Date() },
    });

    if (!booking) {
        throw new APIerror(404, "Booking not found or expired")
    }

    const payment = await Payment.findOne({
        bookingId,
        status: "CREATED",
    });

    if (!payment) {
        throw new APIerror(404, "Payment record not found");
    }

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = paymentId;
    await payment.save();

    booking.bookingStatus = "CONFIRMED";
    booking.paymentId = payment._id;
    booking.expiresAt = null;
    await booking.save();

    res.status(200).json(
        new APIresponse(200, booking, "Booking confirmed successfully")
    );
})


const cancelBooking = asyncHandler(async (req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
        bookingStatus: {
            $in: ["PENDING", "CONFIRMED"]
        }
    });

    if (!booking) {
        throw new APIerror(404, "Booking not found")
    }

    booking.bookingStatus = "CANCELLED";
    booking.expiresAt = null;
    await booking.save();

    res.status(200)
        .json(
            new APIresponse(200, booking, "Booking cancelled successfully")
        )

})


const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({
        userId: req.user._id
    })
        .populate("movieId")
        .populate("theatreId")
        .sort({ createdAt: -1 });

    res.status(200).json(
        new APIresponse(200, bookings, "Bookings fetched successfully")
    );
});


export {
    createBooking,
    confirmBooking,
    cancelBooking,
    getMyBookings,
    lockedSeat,
}