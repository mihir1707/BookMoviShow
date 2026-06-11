import mongoose from "mongoose";
import "dotenv/config";
import { City } from "../models/city.model.js";
import { Theater } from "../models/theater.model.js";
import connectDB from "../db/db.js";

async function run() {
    await connectDB();
    const theaters = await Theater.find({ isActive: true }).populate("cityId");
    
    const cityCounts = {};
    for (const t of theaters) {
        const cityName = t.cityId?.name || "Unknown";
        cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
    }
    console.log("Theaters per city:", cityCounts);
    process.exit(0);
}
run();
