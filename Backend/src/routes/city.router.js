import { Router } from 'express'
import { getAllCities, getCityById, searchCity } from '../controllers/city.controller.js';

const router = Router();

router.route('/').get(getAllCities)
router.route('/search').get(searchCity)
router.route('/:id').get(getCityById)

export default router;