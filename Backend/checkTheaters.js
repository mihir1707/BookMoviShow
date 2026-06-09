import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "/mnt/My Programs/Project/BookMoviShow/Backend/.env" });

const dbUrl = process.env.MONGODB_URI;

mongoose.connect(`${dbUrl}/BookMoviShow`).then(async () => {
    console.log("Connected to DB");

    const db = mongoose.connection.db;

    const cities = await db.collection("cities").find({ name: { $in: ["Mumbai", "Ahmedabad"] } }).toArray();
    console.log("Cities found:", cities.map(c => ({ id: c._id, name: c.name })));

    for (const city of cities) {
        const theaters = await db.collection("theaters").find({ cityId: city._id }).toArray();
        console.log(`\nTheaters in ${city.name} (${theaters.length}):`);
        theaters.forEach(t => console.log(` - ${t.name}`));
    }

    process.exit(0);
}).catch(console.error);
