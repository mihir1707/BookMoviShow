import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createRazorpayOrder,
    verifyRazorpayPayment,
} from "../controllers/razorpay.controller.js";

const router = Router();

router.route('/create-order').post(verifyJWT, createRazorpayOrder)
router.route('/verify').post(verifyJWT, verifyRazorpayPayment)

export default router;
