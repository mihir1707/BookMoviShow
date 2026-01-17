import axios from "axios";

const pvrNowShowing = axios.create({
    baseURL: process.env.PVR_NOWSHOWING_API,
    headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
        appversion: "1.0",
        chain: "PVR",
        city: "Gandhinagar",
        country: "INDIA",
        platform: "MSITE",
        origin: "https://www.pvrcinemas.com",
        authorization: "Bearer",
    },
});

export default pvrNowShowing;
