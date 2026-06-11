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
    const { movieId, cityId, cityName, lat, lng, radius = 20000 } = req.query;

    if (!movieId) {
        throw new APIerror(400, "movieId is required");
    }
    
    if (!cityId && !cityName && (!lat || !lng)) {
        throw new APIerror(400, "cityId, cityName or lat/lng is required");
    }

    let theaters = [];

    // 1. Find theaters
    if (cityId && cityId !== "undefined") {
        theaters = await Theater.find({ cityId, isActive: true }).lean();
        if (!theaters.length) {
            const { City } = await import("../models/city.model.js");
            const city = await City.findById(cityId);
            if (city) {
                try {
                    const { getTheatresByRadius } = await import("../services/geoapify.services.js");
                    const { mapGeoapifyToTheater } = await import("../utils/theatre.mapper.js");
                    const places = await getTheatresByRadius(city.latitude, city.longitude, 20000);
                    if (places && places.length > 0) {
                        const bulkOps = [];
                        for (const place of places) {
                            if (!place?.properties?.place_id) continue;
                            const theaterData = mapGeoapifyToTheater(place, city._id, null);
                            if (theaterData?.geoapifyPlaceId) {
                                bulkOps.push({
                                    updateOne: {
                                        filter: { $or: [{ geoapifyPlaceId: theaterData.geoapifyPlaceId }, { name: theaterData.name, cityId: theaterData.cityId }] },
                                        update: { $set: theaterData },
                                        upsert: true,
                                    },
                                });
                            }
                        }
                        if (bulkOps.length > 0) {
                            await Theater.bulkWrite(bulkOps, { ordered: false });
                            theaters = await Theater.find({ cityId: city._id, isActive: true }).lean();
                        }
                    }
                } catch (e) {
                    console.error("Auto-seed theaters error (cityId):", e);
                }
            }
        }
    } else if (cityName && cityName !== "undefined") {
        const { City } = await import("../models/city.model.js");
        const city = await City.findOne({ name: { $regex: new RegExp(`^${cityName}$`, 'i') } });
        if (city) {
            theaters = await Theater.find({ cityId: city._id, isActive: true }).lean();
            if (!theaters.length) {
                // Auto-seed from Geoapify
                try {
                    const { getTheatresByRadius } = await import("../services/geoapify.services.js");
                    const { mapGeoapifyToTheater } = await import("../utils/theatre.mapper.js");
                    const places = await getTheatresByRadius(city.latitude, city.longitude, 20000);
                    if (places && places.length > 0) {
                        const bulkOps = [];
                        for (const place of places) {
                            if (!place?.properties?.place_id) continue;
                            const theaterData = mapGeoapifyToTheater(place, city._id, null);
                            if (theaterData?.geoapifyPlaceId) {
                                bulkOps.push({
                                    updateOne: {
                                        filter: { $or: [{ geoapifyPlaceId: theaterData.geoapifyPlaceId }, { name: theaterData.name, cityId: theaterData.cityId }] },
                                        update: { $set: theaterData },
                                        upsert: true,
                                    },
                                });
                            }
                        }
                        if (bulkOps.length > 0) {
                            await Theater.bulkWrite(bulkOps, { ordered: false });
                            theaters = await Theater.find({ cityId: city._id, isActive: true }).lean();
                        }
                    }
                } catch (e) {
                    console.error("Auto-seed theaters error:", e);
                }
            }
        }
    } else if (lat && lng) {
        theaters = await Theater.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
                    $maxDistance: Number(radius),
                },
            },
        }).lean();
        if (!theaters.length) {
            // Auto-seed from Geoapify for lat/lng
            try {
                const { getTheatresByRadius } = await import("../services/geoapify.services.js");
                const { mapGeoapifyToTheater } = await import("../utils/theatre.mapper.js");
                const places = await getTheatresByRadius(Number(lat), Number(lng), Number(radius));
                if (places && places.length > 0) {
                    const bulkOps = [];
                    for (const place of places) {
                        if (!place?.properties?.place_id) continue;
                        const theaterData = mapGeoapifyToTheater(place, null, null);
                        if (theaterData?.geoapifyPlaceId) {
                            bulkOps.push({
                                updateOne: {
                                    filter: { geoapifyPlaceId: theaterData.geoapifyPlaceId },
                                    update: { $set: theaterData },
                                    upsert: true,
                                },
                            });
                        }
                    }
                    if (bulkOps.length > 0) {
                        await Theater.bulkWrite(bulkOps, { ordered: false });
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
                }
            } catch (e) {
                console.error("Auto-seed theaters error:", e);
            }
        }
    }

    if (!theaters.length) {
        return res.status(200).json(new APIresponse(200, [], "No theaters found"));
    }

    const theaterIds = theaters.map(t => t._id);

    // 2. Find all shows for these theaters and this movie
    let shows = await Show.find({
        movieId,
        theatreId: { $in: theaterIds },
        isActive: true
    }).populate("screenId").lean();

    // 3. Auto-seed shows if none exist for this movie and theater
    if (shows.length === 0 && theaters.length > 0) {
        try {
            console.log("No shows found for this movie. Auto-generating random shows...");
            const { seedRandomShowsForMovieAndTheaters } = await import("../utils/showSeeder.js");
            await seedRandomShowsForMovieAndTheaters(movieId, theaters);
            shows = await Show.find({
                movieId,
                theatreId: { $in: theaterIds },
                isActive: true
            }).populate("screenId").lean();
        } catch (e) {
            console.error("Auto-seed shows error:", e);
        }
    }

    // 4. Group by Theater and structure it nicely
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
