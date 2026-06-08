import axios from "axios";

const api = process.env.PVR_CITIES_API

export const fetchPVRCities = async () => {
    const response = await axios.post(
        api,
        {
            lat: "23.1572668",
            lng: "72.5898202",
        },
        {
            headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
                appversion: "1.0",
                chain: "PVR",
                city: "Gandhinagar",
                country: "INDIA",
                flow: "PVRINOX",
                platform: "MSITE",
                origin: "https://www.pvrcinemas.com",
                referer: "https://www.pvrcinemas.com/",
            },
        }
    );

    return response.data;
};
