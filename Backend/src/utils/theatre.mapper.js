export const mapGeoapifyToTheater = (place, cityId, adminId) => {
    const [lng, lat] = place.geometry.coordinates;

    return {
        name: place.properties.name,
        slug: place.properties.name
            .toLowerCase()
            .replace(/\s+/g, "-"),

        cityId,

        address: {
            full: place.properties.formatted,
            line1: place.properties.address_line1,
            line2: place.properties.address_line2,
            postcode: place.properties.postcode,
            state: place.properties.state,
            country: place.properties.country,
        },

        location: {
            type: "Point",
            coordinates: [lng, lat],
        },

        geoapifyPlaceId: place.properties.place_id,

        screensCount: 1,
        createdById: adminId,
    };
};
