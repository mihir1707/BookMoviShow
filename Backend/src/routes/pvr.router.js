import { Router } from 'express'
import { searchCity } from '../controllers/city.controller.js';
import { nowShowing } from '../controllers/pvr/nowShowing.controller.js';
import { upComing } from '../controllers/pvr/upComingMoives.controller.js';

const router = Router();

router.get('/search-city', searchCity)
router.post('/now-showing', nowShowing)
router.post('/up-coming', upComing)

export default router;