import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Movie } from "../models/movie.model.js";
import { Theater } from "../models/theater.model.js";
import { Screen } from "../models/screen.model.js";
import { Show } from "../models/show.model.js";
import { MoviesShowData } from "../data/showData.js";

const MONGODB_URL = process.env.MONGODB_URL + "/bookMovie";
const DAYS = 4;
const SHOW_CONFIG = MoviesShowData[0];

// ------------------ helpers ------------------
const parseTimeToMinutes = (timeStr) => {
    const [time, meridian] = timeStr.split(" ");
    let [hour, minute] = time.split(":").map(Number);

    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    return hour * 60 + minute;
};

// ------------------ main seeder ------------------
const seedAllRunningMoviesShows = async () => {
    await mongoose.connect(MONGODB_URL);
    console.log("✅ MongoDB connected");

    const movies = await Movie.find({ isActive: true });
    const theaters = await Theater.find({ isActive: true });
    const screens = await Screen.find({ isActive: true });

    if (!movies.length || !theaters.length || !screens.length) {
        console.log("❌ Movies / theaters / screens missing");
        process.exit(0);
    }

    // group screens by theater
    const screensByTheater = screens.reduce((acc, screen) => {
        const key = screen.theaterId.toString();
        acc[key] ||= [];
        acc[key].push(screen);
        return acc;
    }, {});

    let created = 0;

    for (let day = 0; day < DAYS; day++) {
        const showDate = new Date();
        showDate.setHours(0, 0, 0, 0);
        showDate.setDate(showDate.getDate() + day);

        for (const movie of movies) {
            for (const theater of theaters) {
                const theaterScreens =
                    screensByTheater[theater._id.toString()] || [];

                for (let i = 0; i < theaterScreens.length; i++) {
                    const screen = theaterScreens[i];

                    // 🔥 match by screen number (NOT index modulo)
                    const screenConfig = SHOW_CONFIG.screens.find(
                        (s) => s.screenNo === i + 1
                    );
                    if (!screenConfig) continue;

                    for (const time of screenConfig.times) {
                        const startTimeMinutes = parseTimeToMinutes(time);

                        const result = await Show.updateOne(
                            {
                                movieId: movie._id,
                                theaterId: theater._id,
                                screenId: screen._id,
                                showDate,
                                startTimeMinutes,
                            },
                            {
                                $setOnInsert: {
                                    movieId: movie._id,
                                    theaterId: theater._id,
                                    screenId: screen._id,
                                    showDate,
                                    startTimeMinutes,
                                    startTimeLabel: time,

                                    // ✅ seat-level pricing stored per show
                                    seatPricing: screenConfig.seats.map((seat) => ({
                                        type: seat.type,
                                        price: seat.price,
                                        totalSeats: seat.total,
                                    })),

                                    language: movie.languages?.[0] || "Hindi",
                                    isActive: true,
                                },
                            },
                            { upsert: true }
                        );

                        if (result.upsertedCount === 1) created++;
                    }
                }
            }
        }
    }

    console.log(`🎬 Shows created: ${created}`);
    await mongoose.disconnect();
    process.exit(0);
};

seedAllRunningMoviesShows();
