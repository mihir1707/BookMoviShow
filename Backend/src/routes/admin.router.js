import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/admin.auth.middleware.js";
import { getAdminTotalRevenue, getRevenueByMovie, getTodayRevenue } from "../controllers/admin.controller.js";


const router = Router()

router.route('/total').get(verifyJWT, adminAuth, getAdminTotalRevenue)
router.route('/today').get(verifyJWT, adminAuth, getTodayRevenue)
router.route('/movie').get(verifyJWT, adminAuth, getRevenueByMovie)


export default router