import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { cancelBooking, confirmBooking, createBooking, getMyBookings } from "../controllers/booking.controller.js";


const router = Router()

router.route('/').post(verifyJWT, createBooking)
router.route('/confirm').post(verifyJWT, confirmBooking)
router.route('/:bookingId/cancel').patch(verifyJWT, cancelBooking)
router.route('/my').get(verifyJWT, getMyBookings)


export default router;