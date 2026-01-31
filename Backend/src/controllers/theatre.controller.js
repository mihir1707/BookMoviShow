import { Theater } from "../models/theater.model.js";
import { getTheatresByRadius } from "../services/geoapify.services.js";
import APIerror from "../utils/APIerrors.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { mapGeoapifyToTheater } from "../utils/theatre.mapper.js";


const seedTheatresByRadius = asyncHandler(async (req, res) => {
    const { lat, lng, cityId, radius = 10000 } = req.body;
    const adminId = req.user?._id;

    if (!lat || !lng || !cityId) {
        throw new APIerror(400, "lat, lng and cityId are required");
    }

    const places = await getTheatresByRadius(lat, lng, radius);

    let insertedCount = 0;

    for (const place of places) {
        if (!place.properties?.name) continue;

        const theaterData = mapGeoapifyToTheater(
            place,
            cityId,
            adminId
        );

        const result = await Theater.updateOne(
            { name: theaterData.name, cityId },
            { $setOnInsert: theaterData },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            insertedCount++;
        }
    }

    return res.status(200).json(
        new APIresponse(
            200,
            { inserted: insertedCount },
            "Theatres seeded successfully"
        )
    );
});


const getTheatresByCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;

    const theatres = await Theater.find({
        cityId,
        isActive: true,
    }).sort({ name: 1 });

    return res.status(200).json(
        new APIresponse(
            200,
            theatres,
            "Theatres fetched successfully"
        )
    );
});


const getNearbyTheatres = asyncHandler(async (req, res) => {
    const { lat, lng, radius = 20000 } = req.query;

    if (!lat || !lng) {
        throw new APIerror(400, "lat and lng are required");
    }

    const theatres = await Theater.find({
        isActive: true,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)],
                },
                $maxDistance: Number(radius),
            },
        },
    });

    return res.status(200).json(
        new APIresponse(
            200,
            theatres,
            "Nearby theatres fetched successfully"
        )
    );
});


export {
    seedTheatresByRadius,
    getTheatresByCity,
    getNearbyTheatres,
};