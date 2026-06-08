import pvrNowShowing from "../../services/pvrNowShowing.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { mapPvrMovie } from "../../utils/pvr/pvrMovieMapper.js";


const nowShowing = asyncHandler( async(req, res) => {

    try{
        const response = await pvrNowShowing.post("", {})

        const movie = response.data?.output?.mv || []

        const showMovies = movie.map(mapPvrMovie)

        return res.status(200)
        .json({
            success: true,
            count: showMovies.length,
            movies: showMovies
        })
    }
    catch(error){
        console.error("PVR NOWSHOWING API Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch now showing movies",
        });
    }

})

export {
    nowShowing,
}