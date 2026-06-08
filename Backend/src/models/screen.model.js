import mongoose from "mongoose";

const seatConfigSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., "VIP", "EXECUTIVE", "NORMAL"
    price: { type: Number, required: true },
    total: { type: Number, required: true }
}, { _id: false });

const screenSchema = new mongoose.Schema(
    {
        screenNo: { type: Number, required: true },
        theatreId: { type: mongoose.Schema.Types.ObjectId, ref: "Theater", required: true },
        seats: [seatConfigSchema]
    },
    { timestamps: true }
);

screenSchema.index({ theatreId: 1, screenNo: 1 }, { unique: true });

export const Screen = mongoose.model("Screen", screenSchema);
