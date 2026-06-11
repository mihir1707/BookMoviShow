import mongoose from "mongoose";
import "dotenv/config";
import { City } from "../models/city.model.js";
import { Theater } from "../models/theater.model.js";
import connectDB from "../db/db.js";

async function run() {
    await connectDB();
    const ahmedabad = await City.findOne({ name: /ahmedabad/i });
    if (!ahmedabad) {
        console.log("Ahmedabad not found");
        process.exit(1);
    }
    
    // Create 2 dummy theaters for Ahmedabad
    await Theater.create([
        {
            name: "PVR: Acropolis, Ahmedabad",
            cityId: ahmedabad._id,
            location: {
                type: "Point",
                coordinates: [72.5218, 23.0526]
            },
            address: {
                line1: "Acropolis Mall, SG Highway",
                line2: "Thaltej",
                state: "Gujarat",
                country: "India",
                postcode: "380054",
                full: "PVR: Acropolis, SG Highway, Thaltej, Ahmedabad"
            },
            isActive: true,
            slug: "pvr-acropolis-ahmedabad"
        },
        {
            name: "Cinepolis: Ahmedabad One Mall",
            cityId: ahmedabad._id,
            location: {
                type: "Point",
                coordinates: [72.5293, 23.0401]
            },
            address: {
                line1: "Ahmedabad One Mall",
                line2: "Vastrapur",
                state: "Gujarat",
                country: "India",
                postcode: "380015",
                full: "Cinepolis: Ahmedabad One Mall, Vastrapur, Ahmedabad"
            },
            isActive: true,
            slug: "cinepolis-ahmedabad-one-mall"
        }
    ]);
    
    console.log("Created 2 theaters for Ahmedabad!");
    process.exit(0);
}
run();
