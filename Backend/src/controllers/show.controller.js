import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import { Show } from "../models/show.model.js";
import { Screen } from "../models/screen.model.js";
import { Theater } from "../models/theater.model.js";

// Admin: Create a Show (and create Screen if needed)
export const addShow = asyncHandler(async (req, res) => {
    const { movieId, theatreId, screenNo, showDate, showTime, seats } = req.body;

    if (!movieId || !theatreId || !screenNo || !showDate || !showTime || !seats) {
        throw new APIerror(400, "All fields are required");
    }

    // Upsert the Screen
    let screen = await Screen.findOne({ theatreId, screenNo });
    if (!screen) {
        screen = await Screen.create({ theatreId, screenNo, seats });
    } else {
        // Update seats if provided
        screen.seats = seats;
        await screen.save();
    }

    // Create the Show
    const show = await Show.create({
        movieId,
        theatreId,
        screenId: screen._id,
        showDate,
        showTime
    });

    return res.status(201).json(new APIresponse(201, show, "Show added successfully"));
});

// Public: Get all theaters and their shows for a specific movie in a city or location
export const getShowsForMovieInCity = asyncHandler(async (req, res) => {
    const { movieId, cityId, lat, lng, radius = 20000 } = req.query;

    if (!movieId) {
        throw new APIerror(400, "movieId is required");
    }
    
    if (!cityId && (!lat || !lng)) {
        throw new APIerror(400, "cityId or lat/lng is required");
    }

    let theaters = [];

    // 1. Find theaters
    if (cityId && cityId !== "undefined") {
        theaters = await Theater.find({ cityId, isActive: true }).lean();
    } else {
        theaters = await Theater.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                    $maxDistance: Number(radius),
                },
            },
        }).lean();
    }

    if (!theaters.length) {
        return res.status(200).json(new APIresponse(200, [], "No theaters found"));
    }

    const theaterIds = theaters.map(t => t._id);

    // 2. Find all shows for these theaters and this movie
    const shows = await Show.find({
        movieId,
        theatreId: { $in: theaterIds },
        isActive: true
    }).populate("screenId").lean();

    // 3. Group by Theater and structure it nicely
    const groupedTheaters = theaters.map(theater => {
        const theaterShows = shows.filter(s => s.theatreId.toString() === theater._id.toString());
        
        // Group by Date -> Screen -> Times
        const showDates = {};
        theaterShows.forEach(show => {
            if (!show.screenId) return; // Skip shows with invalid/missing screen data

            if (!showDates[show.showDate]) {
                showDates[show.showDate] = {
                    screens: []
                };
            }
            
            let screenObj = showDates[show.showDate].screens.find(s => s.screenNo === show.screenId.screenNo);
            if (!screenObj) {
                screenObj = {
                    screenNo: show.screenId.screenNo,
                    seats: show.screenId.seats,
                    times: []
                };
                showDates[show.showDate].screens.push(screenObj);
            }

            screenObj.times.push({
                showId: show._id,
                time: show.showTime
            });
        });

        return {
            ...theater,
            showDates
        };
    }).filter(t => Object.keys(t.showDates).length > 0); // Only return theaters with actual shows

    return res.status(200).json(new APIresponse(200, groupedTheaters, "Shows fetched successfully"));
});

// Public: Get a specific Show with Screen details
export const getShowDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const show = await Show.findById(id).populate("screenId").populate("theatreId").populate("movieId").lean();
    
    if (!show) {
        throw new APIerror(404, "Show not found");
    }

    return res.status(200).json(new APIresponse(200, show, "Show details fetched"));
});
