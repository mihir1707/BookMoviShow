import mongoose from "mongoose";
import { Show } from "../models/show.model.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import "../models/screen.model.js";

const FIXED_RADIUS = 20000; // meters
const EARTH_RADIUS_KM = 6378.1;

const getShowsByMovieAndDate = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const { date, lat, lng, useDistance } = req.query;

    // ---------------- validations ----------------
    if (!date) throw new APIerror(400, "date is required");
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        throw new APIerror(400, "Invalid movieId");
    }

    const userLat =
        lat !== undefined && !isNaN(Number(lat)) ? Number(lat) : null;
    const userLng =
        lng !== undefined && !isNaN(Number(lng)) ? Number(lng) : null;

    // ---------------- date range ----------------
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ---------------- fetch shows ----------------
    const shows = await Show.find({
        movieId: new mongoose.Types.ObjectId(movieId),
        showDate: { $gte: startOfDay, $lt: endOfDay },
        isActive: true,
    })
        .populate("movieId", "title poster")
        .populate("theaterId", "name location")
        .populate("screenId", "name")
        .sort({ startTimeMinutes: 1 });

    if (!shows.length) {
        return res
            .status(200)
            .json(new APIresponse(200, [], "No shows available"));
    }

    // ---------------- OPTIONAL distance filter ----------------
    let filteredShows = shows;

    const shouldApplyDistance =
        useDistance === "true" &&
        userLat !== null &&
        userLng !== null;

    if (shouldApplyDistance) {
        filteredShows = shows.filter((show) => {
            const location = show.theaterId?.location;
            if (!location || !Array.isArray(location.coordinates)) return false;

            const [tLng, tLat] = location.coordinates;

            const dLat = ((tLat - userLat) * Math.PI) / 180;
            const dLng = ((tLng - userLng) * Math.PI) / 180;

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos((userLat * Math.PI) / 180) *
                Math.cos((tLat * Math.PI) / 180) *
                Math.sin(dLng / 2) ** 2;

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = EARTH_RADIUS_KM * c * 1000;

            return distance <= FIXED_RADIUS;
        });
    }

    if (!filteredShows.length) {
        return res
            .status(200)
            .json(new APIresponse(200, [], "No nearby shows available"));
    }

    // ---------------- group data ----------------
    const grouped = {};

    for (const show of filteredShows) {
        const mId = show.movieId._id.toString();
        const tId = show.theaterId._id.toString();
        const sId = show.screenId._id.toString();

        if (!grouped[mId]) {
            grouped[mId] = {
                movieId: mId,
                movieTitle: show.movieId.title,
                poster: show.movieId.poster,
                theaters: {},
            };
        }

        if (!grouped[mId].theaters[tId]) {
            grouped[mId].theaters[tId] = {
                theaterId: tId,
                theaterName: show.theaterId.name,
                screens: {},
            };
        }

        if (!grouped[mId].theaters[tId].screens[sId]) {
            grouped[mId].theaters[tId].screens[sId] = {
                screenId: sId,
                screenName: show.screenId.name,
                shows: [],
            };
        }

        grouped[mId].theaters[tId].screens[sId].shows.push({
            showId: show._id,
            startTimeMinutes: show.startTimeMinutes,
            time: show.startTimeLabel,
            language: show.language,
            seatPricing: show.seatPricing,
        });
    }

    // ---------------- response ----------------
    const response = Object.values(grouped).map((movie) => ({
        movieId: movie.movieId,
        movieTitle: movie.movieTitle,
        poster: movie.poster,
        theaters: Object.values(movie.theaters).map((t) => ({
            theaterId: t.theaterId,
            theaterName: t.theaterName,
            screens: Object.values(t.screens),
        })),
    }));

    return res.status(200).json(
        new APIresponse(
            200,
            response,
            "Theaters showing this movie fetched successfully"
        )
    );
});

export { getShowsByMovieAndDate };
