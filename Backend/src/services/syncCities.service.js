import { City } from "../models/city.model.js";
import { fetchPVRCities } from "./location.js";

const syncCities = async () => {
    const data = await fetchPVRCities();

    const allCitiesRaw = [
        ...(data?.output?.ot || []),
        ...(data?.output?.pc || []),
        ...(data?.output?.nc || []),
    ];

    if (!allCitiesRaw.length) {
        throw new Error("City data unavailable");
    }

    // console.log(allCitiesRaw)

    const bulkOps = allCitiesRaw.map(city => ({
        updateOne: {
            filter: { cityId: city.id },
            update: {
                cityId: city.id,
                name: city.name,
                state: city.state,
                region: city.region,
                cinemaCount: city.cinemaCount,
                latitude: Number(city.lat),
                longitude: Number(city.lng),
                country: "india",
            },
            upsert: true,
        },
    }));

    // console.log(bulkOps)

    await City.bulkWrite(bulkOps);

    return bulkOps.length

}

export default syncCities;