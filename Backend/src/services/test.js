import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
    const res = await axios.get("https://api.geoapify.com/v2/places", {
        params: {
            categories: "entertainment.cinema",
            filter: "circle:72.587214,23.02691,10000",
            bias: "proximity:72.587214,23.02691",
            limit: 20,
            apiKey: process.env.GEOAPIFY_API_KEY,
        },
    });

    console.log(res.data.features.map(f => f.properties.name));
};

test();
