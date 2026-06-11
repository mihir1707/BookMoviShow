import mongoose from "mongoose";
import "dotenv/config";
import { City } from "../models/city.model.js";
import { Theater } from "../models/theater.model.js";
import connectDB from "../db/db.js";

async function run() {
    await connectDB();
    const city = await City.findOne({ name: /ahmedabad/i });
    console.log("City:", city);
    if (city) {
        const theaters = await Theater.find({ cityId: city._id });
        console.log("Theaters in Ahmedabad:", theaters.length);
        console.log(theaters.map(t => t.name));
    }
    process.exit(0);
}
run();
