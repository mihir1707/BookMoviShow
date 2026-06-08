import asyncHandler from "../utils/asyncHandler.js";
import APIresponse from "../utils/APIresponse.js";
import { User } from "../models/user.model.js";
import { Booking } from "../models/booking.model.js";
import syncMoviesFromPVR from "../services/syncMovies.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments({ bookingStatus: "CONFIRMED" });
    
    const revenueResult = await Booking.aggregate([
        { $match: { bookingStatus: "CONFIRMED" } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const activeBookings = await Booking.countDocuments({
        bookingStatus: { $in: ["CONFIRMED", "PENDING"] }
    });

    res.status(200).json(
        new APIresponse(200, { totalUsers, totalBookings, totalRevenue, activeBookings }, "Stats fetched successfully")
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    res.status(200).json(
        new APIresponse(200, users, "Users fetched successfully")
    );
});

export const syncMovies = asyncHandler(async (req, res) => {
    const count = await syncMoviesFromPVR();
    res.status(200).json(
        new APIresponse(200, { syncedCount: count }, `${count} movies synced successfully from TMDB/PVR`)
    );
});
