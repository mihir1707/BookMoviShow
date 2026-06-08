import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            index: true,
        },

        cityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "City",
            required: true,
            index: true,
        },

        address: {
            full: {
                type: String,
                required: true,
            },
            line1: String,
            line2: String,
            postcode: String,
            state: String,
            country: {
                type: String,
                default: "India",
            },
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        geoapifyPlaceId: {
            type: String,
            unique: true,
            sparse: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        createdById: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    },
    { timestamps: true }
);

theaterSchema.index({ location: "2dsphere" });
theaterSchema.index({ slug: 1, cityId: 1 }, { unique: true });

export const Theater = mongoose.model("Theater", theaterSchema);
