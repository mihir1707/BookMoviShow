import mongoose from "mongoose";
import "dotenv/config";
import { Movie } from "../models/movie.model.js";
import { Theater } from "../models/theater.model.js";
import { Show } from "../models/show.model.js";
import { Screen } from "../models/screen.model.js";
import connectDB from "../db/db.js";
import { MoviesShowData } from "../../../Frontend/src/assets/ShowData.js";

function getRandomElements(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateDates(numDays) {
    const dates = [];
    for (let i = 0; i < numDays; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const day = String(d.getDate()).padStart(2, '0');
        // use hardcoded months to ensure consistency with frontend
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthStr = MONTHS[d.getMonth()];
        dates.push(`${day} ${monthStr}`);
    }
    return dates;
}

const seedRandomShows = async () => {
    try {
        await connectDB();

        console.log("Cleaning up old Shows and Screens...");
        await Show.deleteMany({});
        await Screen.deleteMany({});

        const movies = await Movie.find({ isActive: true });
        const theaters = await Theater.find({ isActive: true });

        if (movies.length === 0 || theaters.length === 0) {
            console.log("No active movies or theaters found. Exiting.");
            process.exit(0);
        }

        const datesToSeed = generateDates(1); // User requested: only for one day
        let screenCount = 0;

        const allScreensData = MoviesShowData[0].screens;

        console.log(`Generating random shows for ${theaters.length} theaters and ${movies.length} movies over 1 days...`);

        const showDocsToInsert = [];

        // For each theater
        for (const theater of theaters) {
            
            // User requested: only pick one screen
            const numScreens = 1;
            const selectedScreenData = getRandomElements(allScreensData, numScreens);

            let localScreenNo = 1;
            for (const sData of selectedScreenData) {
                // Create screen in DB immediately so we get the _id
                const screenDoc = await Screen.create({
                    theatreId: theater._id,
                    screenNo: localScreenNo,
                    seats: sData.seats
                });
                screenCount++;

                // Assign a random active movie to this screen
                const randomMovie = movies[Math.floor(Math.random() * movies.length)];

                // For each of the 7 days, generate the shows for that movie on this screen
                for (const date of datesToSeed) {
                    for (const time of sData.times) {
                        showDocsToInsert.push({
                            movieId: randomMovie._id,
                            theatreId: theater._id,
                            screenId: screenDoc._id,
                            showDate: date,
                            showTime: time,
                            isActive: true
                        });
                    }
                }
                
                localScreenNo++;
            }
        }
        
        console.log(`Bulk inserting ${showDocsToInsert.length} shows...`);
        await Show.insertMany(showDocsToInsert);

        console.log(`Successfully generated ${screenCount} Screens and ${showDocsToInsert.length} Shows!`);
        process.exit(0);
    } catch (err) {
        console.error("Error seeding shows:", err);
        process.exit(1);
    }
};

seedRandomShows();
