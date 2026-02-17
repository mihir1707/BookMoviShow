import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const opts = {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 30000,
            connectTimeoutMS: 10000,
            family: 4,
            retryWrites: true,
            w: "majority",
        };

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, opts);

        console.log(`MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);

        mongoose.connection.on("connected", () => console.log("Mongoose connected"));
        mongoose.connection.on("reconnected", () => console.log("Mongoose reconnected"));
        mongoose.connection.on("disconnected", () => console.warn("Mongoose disconnected"));
        mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err));
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export default connectDB;
