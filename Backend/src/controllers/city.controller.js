import { fetchPVRCities } from "../services/location.js";
import asyncHandler from "../utils/asyncHandler.js";

const searchCity = asyncHandler(async (req, res) => {
    const city = req.query.city?.trim().toLowerCase();

    const data = await fetchPVRCities();

    const allCitiesRaw = [
        ...(data?.output?.ot || []),
        ...(data?.output?.pc || []),
        ...(data?.output?.nc || []),
    ];

    if (!Array.isArray(allCitiesRaw) || allCitiesRaw.length === 0) {
        return res.status(500).json({ message: "City data unavailable" });
    }

    const cityMap = new Map();
    allCitiesRaw.forEach(c => {
        if (c?.id) cityMap.set(c.id, c);
    });

    let allCities = Array.from(cityMap.values());

    if (city) {
        allCities = allCities.filter(c =>
            c.name.toLowerCase().includes(city)
        );
    }

    allCities.sort((a, b) => a.name.localeCompare(b.name));

    return res.status(200).json(allCities);
});

export { searchCity };
