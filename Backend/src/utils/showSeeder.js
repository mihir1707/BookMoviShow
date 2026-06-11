import { Show } from "../models/show.model.js";
import { Screen } from "../models/screen.model.js";
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

export const seedRandomShowsForMovieAndTheaters = async (movieId, theaters) => {
    try {
        const datesToSeed = generateDates(1); // User requested: only for one day
        const allScreensData = MoviesShowData[0].screens;
        const showDocsToInsert = [];

        for (const theater of theaters) {
            const numScreens = 1; // User requested: only pick one screen
            const selectedScreenData = getRandomElements(allScreensData, numScreens);

            let localScreenNo = 1;
            for (const sData of selectedScreenData) {
                let screenDoc = await Screen.findOne({ theatreId: theater._id, screenNo: localScreenNo });
                if (!screenDoc) {
                    screenDoc = await Screen.create({
                        theatreId: theater._id,
                        screenNo: localScreenNo,
                        seats: sData.seats
                    });
                }

                for (const date of datesToSeed) {
                    for (const time of sData.times) {
                        showDocsToInsert.push({
                            movieId: movieId,
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
        
        if (showDocsToInsert.length > 0) {
            await Show.insertMany(showDocsToInsert);
        }
        
        return true;
    } catch (err) {
        console.error("Error auto-seeding shows:", err);
        return false;
    }
};
