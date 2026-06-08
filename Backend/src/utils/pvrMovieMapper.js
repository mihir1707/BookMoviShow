const toTitleCase = (str) => {
    return String(str).toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

const toArrayConvert = (value) => {
    if (Array.isArray(value)) return value.map(v => String(v).trim())
    if (typeof value === "string") {
        return value.split(",").map(v => v.trim()).filter(Boolean)
    }
    return []
}

const generateSlug = (title = "") => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
};


export const mapPvrMovie = (movie) => {

    const cleanName = movie.filmName ?.replace(/\s*\([^)]*\)/g, "").trim()
    const formatedName = cleanName ? toTitleCase(cleanName) : ""
    const slug = generateSlug(formatedName);

    return {
        pvrId: movie.id,

        title: formatedName,

        slug,

        description: movie.synopsis?.trim() || "No description available",

        runtime: movie.mlength,

        releaseDate: new Date(movie.releaseDate),

        genres: movie.grs,

        languages: movie.mfs,

        posterUrl: movie.miv || movie.mih || "",

        bannerUrl: movie.mih || null,

        trailerUrl: movie.mtrailerurl || null,

        censorRating: movie.ce || "UA",

        cast: toArrayConvert(movie.starring),

        crew: toArrayConvert(movie.director),

        isActive: movie.movieType === "NOWSHOWING",
    };
};
