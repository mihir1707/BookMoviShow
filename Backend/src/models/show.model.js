import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
        theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
        screenId: { type: mongoose.Schema.Types.ObjectId, ref: "Screen", required: true },
        showDate: { type: String, required: true }, // Format: DD MMM (e.g. "12 Jun")
        showTime: { type: String, required: true }, // Format: HH:MM AM/PM
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

showSchema.index({ theatreId: 1, movieId: 1, showDate: 1 });

export const Show = mongoose.model("Show", showSchema);
