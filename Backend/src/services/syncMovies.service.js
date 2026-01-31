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

    const bulkOps = allMovies.map(movie => ({
        updateOne: {
            filter: { pvrId: movie.pvrId },
            update: {
                $set: movie
            },
            upsert: true,
        },
    }));

    await Movie.bulkWrite(bulkOps);

    return allMovies.length;
}

export default syncMoviesFromPVR