import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import { Booking } from "../models/booking.model.js";
import crypto from "crypto";

const LOCK_TIME = 10

const createBooking = asyncHandler( async(req, res) => {

    const {movieId, theatreId, seats} = req.body

    if (!movieId || !theatreId) {
        throw new APIerror(400, "Movie and theatre are required");
    }

    if (!seats || seats.length === 0) {
        throw new APIerror(400, "No seats selected");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const conflict = await Booking.findOne({
            movieId,
            theatreId,
            bookingStatus: { 
                $in: ["PENDING", "CONFIRMED"] 
            },
            "seats.seatNumber": { $in: seatNumbers },},
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
                seats,
                seatCount: seats.length,
                totalAmount,
                bookingStatus: "PENDING",
                bookingCode: `BMS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
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
    catch(error){
        await session.abortTransaction();
        console.log("error when createBooking")
        throw error;
    }
    finally{
        session.endSession();
    }

})


const confirmBooking = asyncHandler( async(req, res) => {

    const {bookingId, paymentId} = req.body

    const booking = await Booking.findOne({
        _id: bookingId,
        bookingStatus: "PENDING",
    })

    if(!booking){
        throw new APIerror(404, "Booking not found or already processed")
    }

    booking.bookingStatus = "CONFIRMED";
    booking.paymentId = paymentId;

    await booking.save();

    res.status(200).json(
        new APIresponse(200, booking, "Booking confirmed successfully")
    );
})


const cancelBooking = asyncHandler( async(req, res) => {

    const { bookingId } = req.params;

    const booking = await Booking.findOne({
        _id: bookingId,
        userId: req.user._id,
        bookingStatus: { 
            $in: ["PENDING", "CONFIRMED"] 
        }
    });

    if(!booking){
        throw new APIerror(404, "Booking not found")
    }

    booking.bookingStatus = "CANCELLED";
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
}