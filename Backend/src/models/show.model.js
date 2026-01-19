import mongoose from "mongoose";

const showSchema = new mongoose.Schema({

    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
        index: true,
    },
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true,
        index: true,
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        index: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0,
    },
    languageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Language",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },

},{timestamps: true})

showSchema.index(
    { screenId: 1, startTime: 1},
    { unique: true } 
);

showSchema.index({ movieId: 1, date: 1 });
showSchema.index({ theatreId: 1, date: 1 });

export const Show = mongoose.model("Show", showSchema)