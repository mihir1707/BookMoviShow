export const mapGeoapifyToTheater = (place, cityId, adminId) => {
    const [lng, lat] = place.geometry.coordinates;

    const name = place.properties?.name || "Unknown Theatre";

    const slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    return {
        name,
        slug: `${slug}-${cityId}`,
        cityId,
        address: {
            full: place.properties?.formatted || "",
            line1: place.properties?.address_line1 || "",
            line2: place.properties?.address_line2 || "",
            postcode: place.properties?.postcode || "",
            state: place.properties?.state || "",
            country: place.properties?.country || "India",
        },
        location: {
            type: "Point",
            coordinates: [lng, lat],
        },
        geoapifyPlaceId: place.properties?.place_id,
        screensCount: 1,
        createdById: adminId,
        isActive: true,
    };
};
