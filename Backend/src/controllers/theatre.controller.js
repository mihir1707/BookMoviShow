import { Theater } from "../models/theater.model.js";
import { getTheatresByRadius, getTheatresByPlaceId, getTheatresByRect } from "../services/geoapify.services.js";
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

    const places = await getTheatresByRadius(
        Number(lat),
        Number(lng),
        Number(radius)
    );

    if (!Array.isArray(places) || places.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No theatres found")
        );
    }

    const bulkOps = [];

    for (const place of places) {
        if (!place?.properties?.place_id) continue;

        const theaterData = mapGeoapifyToTheater(
            place,
            cityId,
            adminId
        );

        if (!theaterData?.geoapifyPlaceId) continue;

        bulkOps.push({
            updateOne: {
                filter: {
                    $or: [
                        { geoapifyPlaceId: theaterData.geoapifyPlaceId },
                        { name: theaterData.name, cityId: theaterData.cityId },
                    ],
                },
                update: { $set: theaterData },
                upsert: true,
            },
        });
    }

    if (bulkOps.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No valid theatres found")
        );
    }

    try {
        const result = await Theater.bulkWrite(bulkOps, { ordered: false });

        return res.status(200).json(
            new APIresponse(
                200,
                { inserted: result.upsertedCount || 0 },
                "Theatres seeded successfully"
            )
        );
    } catch (error) {
        console.warn('[seedTheatresByRadius] bulkWrite error:', error.message);
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, 'Theatres seeded with some conflicts (duplicates skipped)')
        );
    }
});

const getTheatresByCity = asyncHandler(async (req, res) => {
    const { cityId } = req.params;

    if (!cityId) {
        throw new APIerror(400, "cityId is required");
    }

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

const getAllTheatres = asyncHandler(async (req, res) => {
    const theatres = await Theater.find().populate('cityId').sort({ createdAt: -1 });
    return res.status(200).json(
        new APIresponse(200, theatres, "All theatres fetched successfully")
    );
});

const seedTheatresByPlaceId = asyncHandler(async (req, res) => {
    const { placeId, cityId } = req.body;
    const adminId = req.user?._id;

    if (!placeId || !cityId) {
        throw new APIerror(400, "placeId and cityId are required");
    }

    const places = await getTheatresByPlaceId(placeId);

    if (!Array.isArray(places) || places.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No theatres found")
        );
    }

    const bulkOps = [];

    for (const place of places) {
        if (!place?.properties?.place_id) continue;

        const theaterData = mapGeoapifyToTheater(
            place,
            cityId,
            adminId
        );

        if (!theaterData?.geoapifyPlaceId) continue;

        bulkOps.push({
            updateOne: {
                filter: {
                    $or: [
                        { geoapifyPlaceId: theaterData.geoapifyPlaceId },
                        { name: theaterData.name, cityId: theaterData.cityId },
                    ],
                },
                update: { $set: theaterData },
                upsert: true,
            },
        });
    }

    if (bulkOps.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No valid theatres found")
        );
    }

    try {
        const result = await Theater.bulkWrite(bulkOps, { ordered: false });

        return res.status(200).json(
            new APIresponse(
                200,
                { inserted: result.upsertedCount || 0 },
                "Theatres seeded by place ID successfully"
            )
        );
    } catch (error) {
        console.warn('[seedTheatresByPlaceId] bulkWrite error:', error.message);
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, 'Theatres seeded with some conflicts (duplicates skipped)')
        );
    }
});

const seedTheatresByRect = asyncHandler(async (req, res) => {
    const { lon1, lat1, lon2, lat2, cityId } = req.body;
    const adminId = req.user?._id;

    if (!lon1 || !lat1 || !lon2 || !lat2 || !cityId) {
        throw new APIerror(400, "Bounding box coordinates and cityId are required");
    }

    const places = await getTheatresByRect(lon1, lat1, lon2, lat2);

    if (!Array.isArray(places) || places.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No theatres found in the bounding box")
        );
    }

    const bulkOps = [];

    for (const place of places) {
        if (!place?.properties?.place_id) continue;

        const theaterData = mapGeoapifyToTheater(
            place,
            cityId,
            adminId
        );

        if (!theaterData?.geoapifyPlaceId) continue;

        bulkOps.push({
            updateOne: {
                filter: {
                    $or: [
                        { geoapifyPlaceId: theaterData.geoapifyPlaceId },
                        { name: theaterData.name, cityId: theaterData.cityId },
                    ],
                },
                update: { $set: theaterData },
                upsert: true,
            },
        });
    }

    if (bulkOps.length === 0) {
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, "No valid theatres found")
        );
    }

    try {
        const result = await Theater.bulkWrite(bulkOps, { ordered: false });

        return res.status(200).json(
            new APIresponse(
                200,
                { inserted: result.upsertedCount || 0 },
                "Theatres seeded by bounding box successfully"
            )
        );
    } catch (error) {
        console.warn('[seedTheatresByRect] bulkWrite error:', error.message);
        return res.status(200).json(
            new APIresponse(200, { inserted: 0 }, 'Theatres seeded with some conflicts (duplicates skipped)')
        );
    }
});

export {
    seedTheatresByRadius,
    seedTheatresByPlaceId,
    seedTheatresByRect,
    getTheatresByCity,
    getNearbyTheatres,
    getAllTheatres,
};