import { Router } from "express";
import { addShow, getShowsForMovieInCity, getShowDetails } from "../controllers/show.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getShowsForMovieInCity);
router.route("/:id").get(getShowDetails);

router.route("/").post(verifyJWT, isAdmin, addShow);

export default router;
