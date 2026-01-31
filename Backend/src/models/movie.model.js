import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({

    pvrId: {
        type: String,
        unique: true,
        index: true,
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    runtime: {
        type: String,
        required: true,
    },

    releaseDate: {
        type: Date,
        required: true,
        index: true,
    },

    genres: [
        {
            type: String,
            index: true,
        },
    ],

    languages: [
        {
            type: String,
            required: true,
        }
    ],

    posterUrl: {
        type: String,
        required: true,
    },

    bannerUrl: {
        type: String,
        default: null,
    },

    trailerUrl: {
        type: String,
        default: null,
    },

    cast: [
        {
            type: String,
            default: null,
        },
    ],

    crew: [
        {
            type: String,
            default: null,
        },
    ],

    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },

    censorRating: {
        type: String,
        required: true,
    },

    popularity: {
        type: Number,
        default: 0,
        index: true,
    },

    bookingCount: {
        type: Number,
        default: 0,
    },

    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
},{ timestamps: true }
);

movieSchema.index({ title: "text", description: "text" });

export const Movie = mongoose.model("Movie", movieSchema);
