import { Router } from "express";
import { createMovie, deleteMovie, getAllMoviesAdmin, updateMovie } from "../controllers/admin.movie.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/admin.auth.middleware.js";


const router = Router()

router.route('/').post(verifyJWT, adminAuth, createMovie)
router.route('/:id').put(verifyJWT, adminAuth, updateMovie)
router.route('/:id').delete(verifyJWT, adminAuth, deleteMovie)
router.route('/').get(verifyJWT, adminAuth, getAllMoviesAdmin)

export default router