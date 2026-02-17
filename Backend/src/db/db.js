import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 30000,
            family: 4
        })
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
    }
    catch(error){
        console.log("MongoDB connection Failed", error);
        throw error;
    }
}

export default connectDB;