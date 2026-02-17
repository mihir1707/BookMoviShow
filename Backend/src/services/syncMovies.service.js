import { Movie } from "../models/movie.model.js";
import { mapPvrMovie } from "../utils/pvrMovieMapper.js";
import pvrNowShowing from "./pvrNowShowing.js";
import pvrUpComing from "./pvrUpComing.js";


const syncMoviesFromPVR = async() => {

    const nowShowingRes = await pvrNowShowing.post("",{})
    const nowShowingMovies = (nowShowingRes.data?.output?.mv || []).map(mapPvrMovie);

    // console.log(nowShowingMovies)

    const upcomingRes = await pvrUpComing.post("",{})
    const upcomingMovies = (upcomingRes.data?.output?.movies || []).map(mapPvrMovie);

    // console.log(upcomingMovies)

    const allMovies = [...nowShowingMovies, ...upcomingMovies];

    const bulkOps = allMovies.map((movie) => ({
        updateOne: {
            // match by pvrId OR slug to avoid duplicate-slug upserts
            filter: { $or: [{ pvrId: movie.pvrId }, { slug: movie.slug }] },
            update: {
                $set: movie,
            },
            upsert: true,
        },
    }));

    try {
        // use unordered execution to reduce impact of single write errors
        await Movie.bulkWrite(bulkOps, { ordered: false });
    } catch (err) {
        // Handle duplicate-key errors gracefully and log details for debugging
        if (err && err.code === 11000) {
            console.warn("syncMoviesFromPVR: duplicate key conflict during bulkWrite:", err.message || err);
        } else {
            console.error("syncMoviesFromPVR bulkWrite error:", err);
            throw err;
        }
    }

    return allMovies.length;
}

export default syncMoviesFromPVR