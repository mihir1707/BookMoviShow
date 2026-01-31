import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createPayment, getMyPayments, getPaymentById } from "../controllers/payment.controller.js"

const router = Router()

router.route('/').post(verifyJWT, createPayment)
router.route('/user').get(verifyJWT, getMyPayments)
router.route('/:id').get(verifyJWT, getPaymentById)


export default router