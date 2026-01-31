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
        const res = await axios.get(GEOAPIFY_BASE_URL, {
            params: {
                categories: "entertainment.cinema",
                filter: `circle:${lng},${lat},${radiusInMeters}`,
                bias: `proximity:${lng},${lat}`,
                limit,
                apiKey: GEOAPIFY_KEY,
            },
        });

        console.log("GEOAPIFY KEY =", process.env.GEOAPIFY_KEY);

        return res.data.features;

    } catch (error) {
        console.error(
            "Geoapify radius search error:",
            error.response?.data || error.message
        );
        return [];
    }
};




// const getTheatres = async () => {
//     const res = await axios.get("https://api.geoapify.com/v2/places", {
//         params: {
//             categories: "entertainment.cinema",
//             filter: "circle:72.587214,23.02691,10000",
//             bias: "proximity:72.587214,23.02691",
//             limit: 20,
//             apiKey: GEOAPIFY_API_KEY,
//         },
//     });
//     console.log(res.data.features);
// };

// getTheatres();
