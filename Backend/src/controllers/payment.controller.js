import { Payment } from "../models/payment.model.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createPayment = asyncHandler( async(req, res) => {

    const {bookingId, amount, paymentMethod} = req.body

    if(!bookingId || !amount || !paymentMethod){
        return res.status(400)
        .json(
            new APIresponse(
                400,
                {},
                "BookingId, amount and payment method are required",
            )
        )
    }

    const payment = await Payment.create({
        bookingId,
        userId: req.user._id,
        amount,
        paymentMethod,
        status: "PENDING"
    })

    return res.status(201).json(
        new APIresponse(
            201,
            payment,
            "Payment created successfully"
        )
    );
})


const updatePaymentStatus = asyncHandler( async(req, res) => {

    const {status, transactionId} = req.body

    if(!status){
        return res.status(400).json(
            new APIresponse(
                400,
                {},
                "Payment status is required"
            )
        );
    }

    const payment = await Payment.findByIdAndUpdate(
        req.params.id,
        {
            status,
            transactionId,
        },
        { new: true }
    );

    if(!payment){
        return res.status(404).json(
            new APIresponse(
                404,
                {},
                "Payment not found"
            )
        );
    }

    return res.status(200).json(
        new APIresponse(
            200,
            payment,
            "Payment updated successfully"
        )
    );
})



const getPaymentById = asyncHandler( async(req, res) => {

    const payment = await Payment.findById(req.params.id)
        .populate("bookingId").populate("UserId", "name email")

    if(!payment){
        return res.status(404).json(
            new APIresponse(
                404,
                {},
                "Payment not found"
            )
        );
    }

    return res.status(200).json(
        new APIresponse(
            200,
            payment,
            "Payment fetched successfully"
        )
    );
})


const getMyPayments = asyncHandler( async(req, res) => {

    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json(
        new APIresponse(
            200,
            payments,
            "User payments fetched successfully"
        )
    );
})

export {
    createPayment,
    updatePaymentStatus,
    getPaymentById,
    getMyPayments,
}