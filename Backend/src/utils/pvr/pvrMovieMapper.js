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

export const mapPvrMovie = (movie) => {

    const cleanName = movie.filmName ?.replace(/\s*\([^)]*\)/g, "").trim()
    const formatedName = cleanName ? toTitleCase(cleanName) : ""

    return {
        id: movie.id,
        name: formatedName,
        releaseDate: movie.releaseDate,
        casts: toArrayConvert(movie.starring),
        director: toArrayConvert(movie.director),
        synopsis: movie.synopsis,
        year: movie.year,
        adult: movie.adult,
        adultMessage: movie.adultMessage,
        backdropImage: movie.backdropImage,
        mstatus: movie.movieType,
        category: movie.category,
        certificate: movie.ce,
        runtime: movie.mlength,
        languages: movie.mfs,
        genres: movie.grs,
        trailer: movie.mtrailerurl,
        miv: movie.miv,
        mih: movie.mih,
    };
};
