import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({

    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    totalSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    seatLayout: {
        type: Object,
        required: true,
        /*
        Example:
        {
            A: { rows: 10, seatsPerRow: 12, price: 200 },
            B: { rows: 5, seatsPerRow: 10, price: 150 }
        }
      */
    },
    isActive: {
        type: Boolean,
        default: true,
    },

},{timestamps: true})

screenSchema.index(
    { theatreId: 1, name: 1 }, 
    { unique: true }
)

export const Screen = mongoose.model("Screen", screenSchema)