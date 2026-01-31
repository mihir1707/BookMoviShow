import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { adminAuth } from "../middlewares/admin.auth.middleware.js";
import { bulkCreateSeats, createSeat, deleteSeat, getSeatsByScreen, toggleSeatStatus } from "../controllers/seat.controller.js";


const router = Router()

router.route('/').post(verifyJWT, adminAuth, createSeat)
router.route('/bulk').post(verifyJWT, adminAuth, bulkCreateSeats)
router.route('/:seatId/toggle').patch(verifyJWT, adminAuth, toggleSeatStatus)
router.route('/:seatId').delete(verifyJWT, adminAuth, deleteSeat)
router.route('/screen/:screenId').post(getSeatsByScreen)

export default router;