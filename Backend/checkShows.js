import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "/mnt/My Programs/Project/BookMoviShow/Backend/.env" });

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(`${dbUrl}/BookMoviShow`).then(async () => {
    console.log("Connected to DB");

    const db = mongoose.connection.db;

    const ahm = await db.collection("cities").findOne({ name: "Ahmedabad" });
    if (!ahm) {
        console.log("Ahmedabad not found");
        process.exit(0);
    }

    const theaters = await db.collection("theaters").find({ cityId: ahm._id }).toArray();
    console.log(`Theaters in Ahmedabad: ${theaters.length}`);

    const theaterIds = theaters.map(t => t._id);
    const shows = await db.collection("shows").find({ theatreId: { $in: theaterIds } }).toArray();

    console.log(`Shows in Ahmedabad: ${shows.length}`);
    if (shows.length > 0) {
        console.log(shows[0]);
    } else {
        console.log("No shows found for any theater in Ahmedabad. This is why they don't show up in TheaterList!");
    }

    process.exit(0);
}).catch(console.error);
