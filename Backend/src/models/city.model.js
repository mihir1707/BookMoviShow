import mongoose from "mongoose";

const citySchema = new mongoose.Schema({

    cityId: {
        type: Number,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true,
    },
    state: {
        type: String,
        trim: true,
        required: true,
        index: true,
        lowercase: true,
    },
    region: {
        type: String,
    },
    cinemaCount: {
        type: Number,
        required: true,
        min: 0,
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        default: "india",
        lowercase: true,
    }

},{timestamps: true})


citySchema.index(
    {
        name: 1, 
        state: 1, 
        country: 1 
    },
    { 
        unique: true 
    }
);

export const City = mongoose.model('City', citySchema)