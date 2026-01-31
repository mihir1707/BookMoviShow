import asyncHandler from "../utils/asyncHandler.js";


const createMovie = asyncHandler( async(req, res) => {

    const {
        pvrId,
        title,
        slug,
        description,
        runtime,
        releaseDate,
        genres,
        languages,
        posterUrl,
        bannerUrl,
        trailerUrl,
        cast,
        crew,
        censorRating,
    } = req.body;

    if(!pvrId || !title || !slug || !releaseDate || !runtime || !posterUrl || !censorRating){
        return res.status(400).json(
            new APIresponse(400, null, "Required fields are missing")
        );
    }

    const existingMovie = await Movie.findOne({
        $or: [{ pvrId }, { slug }]
    });

    if(existingMovie){
        return res.status(409).json(
            new APIresponse(409, null, "Movie already exists")
        );
    }

    const movie = await Movie.create({
        pvrId,
        title,
        slug,
        description,
        runtime,
        releaseDate,
        genres,
        languages,
        posterUrl,
        bannerUrl,
        trailerUrl,
        cast,
        crew,
        censorRating,
        isActive: true,
    });

    return res.status(201).json(
        new APIresponse(201, movie, "Movie created successfully")
    );
})


const updateMovie = asyncHandler( async(req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
            new APIresponse(400, null, "Invalid movie ID")
        );
    }

    const movie = await Movie.findByIdAndUpdate(
        id,
        req.body,
        { 
            new: true, 
            runValidators: true 
        }
    );

    if(!movie){
        return res.status(404).json(
            new APIresponse(404, null, "Movie not found")
        );
    }

    return res.status(200).json(
        new APIresponse(200, movie, "Movie updated successfully")
    );
});


const deleteMovie = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json(
            new APIresponse(400, null, "Invalid movie ID")
        );
    }

    const movie = await Movie.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!movie) {
        return res.status(404).json(
            new APIresponse(404, null, "Movie not found")
        );
    }

    return res.status(200).json(
        new APIresponse(200, null, "Movie removed successfully")
    );
});

const getAllMoviesAdmin = asyncHandler(async (req, res) => {
    const movies = await Movie.find({})
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new APIresponse(200, movies, "All movies fetched successfully")
    );
});


export {
    createMovie,
    updateMovie,
    deleteMovie,
    getAllMoviesAdmin,
}