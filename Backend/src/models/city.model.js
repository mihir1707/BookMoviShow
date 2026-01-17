import mongoose from "mongoose";

const citySchema = new mongoose.Schema({

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
    country: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    }

},{timestamps: true})


// The combination of name + state + country must be unique,but each field alone can repeat.
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