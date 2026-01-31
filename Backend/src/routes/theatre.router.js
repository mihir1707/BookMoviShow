import { Router } from "express";
import { getNearbyTheatres, getTheatresByCity, seedTheatresByRadius } from "../controllers/theatre.controller.js";

const router = Router()


router.route('/seed').post(seedTheatresByRadius)
router.route('/city/:cityId').get(getTheatresByCity)
router.route('/nearby').get(getNearbyTheatres)


export default router;
