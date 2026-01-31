import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import { Booking } from "../models/booking.model.js";
import { SeatAvailability } from "../models/seatAvailability.model.js";
import crypto from "crypto";


const createBooking = asyncHandler( async(req, res) => {

    const {movieId, showId, theatreId, screenId, seatIds} = req.body

    if(!seatIds || seatIds.length === 0) {
        throw new APIerror(400, "No seats selected");
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const seats = await SeatAvailability.find({
            showId,
            seatId: {
                $in: seatIds,
            },
            status: "AVAILABLE",
        }).session(session)

        if(seats.length!==seatIds.length){
            throw new APIerror(409, "Some seats are already booked")
        }

        const lockUntil = new Date(Date.now() + 10 * 60 * 1000);

        await SeatAvailability.updateMany(
            {
                showId,
                seatId: {
                    $in: seatIds,
                }
            },
            {
                $set: {
                    status: "LOCKED",
                    lockedUntil: lockUntil
                }
            },
            {
                session,
            }
        )

        const bookingSeats = seats.map(seat => ({
            seatId: seat.seatId,
            seatNumber: seat.seatId.seatNumber,
            price: seat.price
        }))

        const totalAmount = seats.reduce(
            (sum, seat) => sum + seat.price,
            0
        );

        const booking = await Booking.create([
            {
                userId: req.user._id,
                movieId,
                showId,
                theatreId,
                screenId,
                seats: bookingSeats,
                seatCount: bookingSeats.length,
                totalAmount,
                bookingCode: `BMS-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
                expiresAt: lockUntil
            }
        ],{ session });

        await SeatAvailability.updateMany(
            {
                showId, 
                seatId: { 
                    $in: seatIds 
                } 
            },
            { 
                $set: { 
                    bookingId: booking[0]._id 
                } 
            },
            { session }
        );

        await session.commitTransaction();

        res.status(201)
        .json(
            new APIresponse(
                201,
                booking[0],
                "Booking created. Proceed to payment.",
            )
        )
    }
    catch(error){
        await session.abortTransaction();
        console.log("error when create booking")
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
        expiresAt: { 
            $gt: new Date() 
        }
    })

    if(!booking){
        throw new APIerror(404, "Booking not found or already processed")
    }

    booking.bookingStatus = "CONFIRMED";
    booking.paymentId = paymentId;
    booking.expiresAt = null;

    await booking.save();

    await SeatAvailability.updateMany(
        { 
            bookingId: booking._id 
        },
        {
            $set: {
                status: "BOOKED",
                lockedUntil: null
            }
        }
    );

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

    await SeatAvailability.updateMany(
        { 
            bookingId: booking._id 
        },
        {
            $set: {
                status: "AVAILABLE",
                bookingId: null,
                lockedUntil: null
            }
        }
    );

    res.status(200)
    .json(
        new APIresponse(200, booking, "Booking cancelled successfully")
    )

})


const getMyBookings = asyncHandler(async (req, res) => {

    const bookings = await Booking.find({ 
        userId: req.user._id 
    })
    .populate("movieId theatreId showId")
    .sort({ createdAt: -1 });

    res.status(200).json(
        new APIresponse(200, bookings, "Bookings fetched successfully")
    );
});


const expireLockedSeats = async () => {

    const expiredSeats = await SeatAvailability.find({
        status: "LOCKED",
        lockedUntil: { $lte: new Date() }
    });

    for(const seat of expiredSeats){
        await SeatAvailability.updateOne(
        { 
            _id: seat._id 
        },
        {
            $set: {
                status: "AVAILABLE",
                bookingId: null,
                lockedUntil: null
            }
        }
        );
    }

    await Booking.updateMany(
        {
            bookingStatus: "PENDING",
            expiresAt: { 
                $lte: new Date() 
            }
        },
        {
            $set: { 
                bookingStatus: "FAILED" 
            } 
        }
    );
};


export {
    createBooking,
    confirmBooking,
    cancelBooking,
    getMyBookings,
    expireLockedSeats,
}