import pvrUpComing from "../../services/pvrUpComing.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { mapPvrMovie } from "../../utils/pvr/pvrMovieMapper.js";


const upComing = asyncHandler( async(req, res) => {
    try{
        const response = await pvrUpComing.post("", {})
        const movie = response.data?.output?.movies || []
        const upcomingMovies = movie.map(mapPvrMovie)

        return res.status(200)
        .json({
            success: true,
            count: upcomingMovies.length,
            movies: upcomingMovies
        })

    }
    catch(error){
        console.error("PVR upComing API Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch upcoming movies",
        });
    }
})

export {
    upComing
}