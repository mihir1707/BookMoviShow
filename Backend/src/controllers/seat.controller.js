import { Seat } from "../models/seat.model.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createSeat = asyncHandler(async (req, res) => {
    const { screenId, row, seatNumber, type, basePrice } = req.body;

    if (!screenId || !row || !seatNumber || !type || basePrice == null) {
        throw new APIerror(400, "All seat fields are required");
    }

    const seat = await Seat.create({
        screenId,
        row,
        seatNumber,
        type,
        basePrice,
    });

    res.status(201).json(
        new APIresponse(201, seat, "Seat created successfully")
    );
});

const bulkCreateSeats = asyncHandler(async (req, res) => {
    const { screenId, seats, type } = req.body;

    if (!screenId || !type || !Array.isArray(seats) || seats.length === 0) {
        throw new APIerror(400, "Invalid seat data");
    }

    const seatDocs = seats
        .filter(s => s.row && s.seatNumber)
        .map(seat => ({
            screenId,
            row: seat.row,
            seatNumber: seat.seatNumber,
            type,
            basePrice: seat.basePrice,
        }));

    let createdSeats = [];

    try {
        createdSeats = await Seat.insertMany(seatDocs, { ordered: false });
    } catch (err) {
        if (err.code !== 11000) throw err;
    }

    res.status(201).json(
        new APIresponse(
            201,
            createdSeats,
            "Seats created successfully"
        )
    );
});

const getSeatsByScreen = asyncHandler(async (req, res) => {
    const { screenId } = req.params;

    const seats = await Seat.find({
        screenId,
        isActive: true,
    })
        .sort({ row: 1, seatNumber: 1 })
        .collation({ locale: "en", numericOrdering: true });

    res.status(200).json(
        new APIresponse(200, seats, "Seats fetched successfully")
    );
});

const toggleSeatStatus = asyncHandler(async (req, res) => {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);

    if (!seat) {
        throw new APIerror(404, "Seat not found");
    }

    if (!seat.isActive) {
        throw new APIerror(400, "Seat is deleted");
    }

    seat.isActive = false;
    await seat.save();

    res.status(200).json(
        new APIresponse(
            200,
            seat,
            "Seat deactivated"
        )
    );
});

const deleteSeat = asyncHandler(async (req, res) => {
    const { seatId } = req.params;
    const seat = await Seat.findById(seatId);

    if (!seat) {
        throw new APIerror(404, "Seat not found");
    }

    seat.isActive = false;
    await seat.save();

    res.status(200).json(
        new APIresponse(200, null, "Seat removed successfully")
    );
});

export {
    createSeat,
    bulkCreateSeats,
    getSeatsByScreen,
    toggleSeatStatus,
    deleteSeat,
};
