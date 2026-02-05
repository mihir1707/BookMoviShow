import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cancelBooking, confirmBooking, createBooking, getMyBookings, lockedSeat } from "../controllers/booking.controller.js";


const router = Router()

router.route('/').post(verifyJWT, createBooking)
router.route('/confirm').post(verifyJWT, confirmBooking)
router.route('/:bookingId/cancel').patch(verifyJWT, cancelBooking)
router.route('/myBooking').get(verifyJWT, getMyBookings)
router.route('/locked-seats').get(lockedSeat)

export default router;