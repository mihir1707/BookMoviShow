import { Router } from "express";
import { getNearbyTheatres, getTheatresByCity, seedTheatresByRadius, getAllTheatres } from "../controllers/theatre.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/all').get(verifyJWT, isAdmin, getAllTheatres)
router.route('/seed').post(verifyJWT, isAdmin, seedTheatresByRadius)
router.route('/city/:cityId').get(getTheatresByCity)
router.route('/nearby').get(getNearbyTheatres)


export default router;
