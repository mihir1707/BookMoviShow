import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
            index: true,
        },

        theaterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Theater",
            required: true,
            index: true,
        },

        screenId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Screen",
            required: true,
            index: true,
        },

        showDate: {
            type: Date,
            required: true,
            index: true,
        },

        startTimeMinutes: {
            type: Number,
            required: true,
            index: true,
        },

        startTimeLabel: {
            type: String,
            required: true,
        },

        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },

        language: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },

        seatPricing: [
            {
                type: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                totalSeats: {
                    type: Number,
                    required: true,
                },
            },
        ],


        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

showSchema.index(
    {
        movieId: 1,
        theaterId: 1,
        screenId: 1,
        showDate: 1,
        startTimeMinutes: 1,
    },
    { unique: true }
);

export const Show = mongoose.model("Show", showSchema);
