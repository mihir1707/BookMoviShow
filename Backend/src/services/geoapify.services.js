import axios from "axios";

const GEOAPIFY_KEY = process.env.GEOAPIFY_KEY;
const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v2/places";

export const getTheatresByRadius = async (
    lat,
    lng,
    radiusInMeters = 20000,
    limit = 20
) => {
    try {
        if (!GEOAPIFY_KEY) {
            throw new Error("Missing GEOAPIFY_KEY");
        }

        const res = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                categories: "entertainment.cinema",
                filter: `circle:${lng},${lat},${radiusInMeters}`,
                bias: `proximity:${lng},${lat}`,
                limit,
                apiKey: GEOAPIFY_KEY,
            },
        });

        return res.data.features || [];
    } catch (error) {
        console.error(
            "Geoapify radius search error:",
            error.response?.data || error.message
        );
        return [];
    }
};

export const getTheatresByPlaceId = async (
    placeId,
    limit = 20
) => {
    try {
        if (!GEOAPIFY_KEY) {
            throw new Error("Missing GEOAPIFY_KEY");
        }

        const res = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                categories: "entertainment.cinema",
                filter: `place:${placeId}`,
                limit,
                apiKey: GEOAPIFY_KEY,
            },
        });

        return res.data.features || [];
    } catch (error) {
        console.error(
            "Geoapify place search error:",
            error.response?.data || error.message
        );
        return [];
    }
};

export const getTheatresByRect = async (
    lon1,
    lat1,
    lon2,
    lat2,
    limit = 20
) => {
    try {
        if (!GEOAPIFY_KEY) {
            throw new Error("Missing GEOAPIFY_KEY");
        }

        const res = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                categories: "entertainment.cinema",
                filter: `rect:${lon1},${lat1},${lon2},${lat2}`,
                limit,
                apiKey: GEOAPIFY_KEY,
            },
        });

        return res.data.features || [];
    } catch (error) {
        console.error(
            "Geoapify rect search error:",
            error.response?.data || error.message
        );
        return [];
    }
};