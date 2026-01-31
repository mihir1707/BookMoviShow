import { Router } from "express";
import { getShowsByMovieAndDate } from "../controllers/show.controller.js";


const router = Router()


router.route('/movie/:movieId').get(getShowsByMovieAndDate)


export default router;
