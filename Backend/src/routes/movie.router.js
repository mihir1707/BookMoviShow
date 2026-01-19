import { Router } from "express";
import { getAllMovies, getMovieById, getNowShowingMovies, getUpcomingMovies, searchMovie } from "../controllers/movie.controller.js";


const router = Router()

router.route('/').get(getAllMovies)
router.route('/now-showing').get(getNowShowingMovies)
router.route('/upcoming').get(getUpcomingMovies)
router.route('/search').get(searchMovie)
router.route('/:id').get(getMovieById)

export default router