import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { Movie } from "../models/movie.model.js";
import APIresponse from "../utils/APIresponse.js";

const getAllMovies = asyncHandler( async(req, res) => {

    const movies = await Movie.find({ isActive: true }).sort({ releaseDate: -1 })

    return res.status(200)
    .json(
        new APIresponse(
            200,
            movies,
            movies.length ? "Movies fetched successfully" : "No movies available"
        )
    )
})



const getNowShowingMovies = asyncHandler( async(req, res) => {

    // lte = less than or equal to
    const movies = await Movie.find({ 
        isActive: true, 
        releaseDate: { 
            $lte: new Date() 
        },
    })
    .sort({ releaseDate: -1 })

    return res.status(200).json(
        new APIresponse(
            200,
            movies,
            movies.length ? "Now showing movies fetched successfully" : "No now showing movies available"
        )
    );
})



const getUpcomingMovies = asyncHandler(async (req, res) => {

    // $gt greater than
    const movies = await Movie.find({
        isActive: false,
        releaseDate: { 
            $gt: new Date() 
        },
    })
    .sort({ releaseDate: 1 });

    return res.status(200).json(
        new APIresponse(
            200,
            movies,
            movies.length ? "Upcoming movies fetched successfully" : "No upcoming movies available"
        )
    );
});



const getMovieById = asyncHandler( async(req, res) => {

    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json(
            new APIresponse(
                400, 
                null, 
                "Invalid movie ID"
            )
        );
    }

    const movie = await Movie.findById(id)

    if(!movie){
        return res.status(404).json(
            new APIresponse(
                404,
                null,
                "Movie not found",
            )
        )
    }

    return res.status(200).json(
        new APIresponse(
            200, 
            movie, 
            "Movie fetched successfully"
        )
    );
})



const searchMovie = asyncHandler( async(req, res) => {

    const {q} = req.query

    if(!q){
        return res.status(400).json(
            new APIresponse(
                400, 
                null, 
                "Search query is required"
            )
        );
    }

    const movies = await Movie.find({
        isActive: true,
        title: {
            $regex: q,
            $options: "i",
        }
    })
    .limit(10)

    return res.status(200).json(
        new APIresponse(
            200,
            movies,
            movies.length ? "Search results fetched successfully" : "No movies match your search"
        )
    )
})


const getMovieBySlug = asyncHandler( async(req, res) => {

    const movie = await Movie.findOne({
        slug: req.params.slug,
        isActive: true,
    })

    if(!movie) {
        return res.status(404).json(
            new APIresponse(404, null, "Movie not found")
        );
    }

    return res.status(200).json(
        new APIresponse(200, movie, "Movie fetched")
    );

})

export {
    getAllMovies,
    getNowShowingMovies,
    getUpcomingMovies,
    getMovieById,
    searchMovie,
    getMovieBySlug,
}