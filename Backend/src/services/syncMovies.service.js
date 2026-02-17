import { Movie } from "../models/movie.model.js";
import { mapPvrMovie } from "../utils/pvrMovieMapper.js";
import pvrNowShowing from "./pvrNowShowing.js";
import pvrUpComing from "./pvrUpComing.js";


const syncMoviesFromPVR = async () => {
    const nowShowingRes = await pvrNowShowing.post("", {});
    const nowShowingMovies = (nowShowingRes.data?.output?.mv || []).map(mapPvrMovie);

    const upcomingRes = await pvrUpComing.post("", {});
    const upcomingMovies = (upcomingRes.data?.output?.movies || []).map(mapPvrMovie);

    const allMovies = [...nowShowingMovies, ...upcomingMovies];

    const uniqueMovies = Array.from(
        new Map(allMovies.map(movie => [movie.pvrId, movie])).values()
    );

    const bulkOps = uniqueMovies.map(movie => ({
        updateOne: {
            filter: { pvrId: movie.pvrId },
            update: { $set: movie },
            upsert: true,
        }
    }));

    await Movie.bulkWrite(bulkOps, { ordered: false });

    return uniqueMovies.length;
};


export default syncMoviesFromPVR