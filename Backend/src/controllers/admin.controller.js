import { Payment } from "../models/payment.model.js";
import APIresponse from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const getAdminTotalRevenue = asyncHandler( async(req, res) => {

    const revenue = await Payment.aggregate([
        {
            $match: {
                status: "SUCCESS"
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: {
                    $sum: "$amount",
                },
                totalPayments: {
                    $sum: 1,
                }
            }
        }
    ])

    return res.status(200).json(
        new APIresponse(
            200,
            {
                totalRevenue: revenue[0]?.totalRevenue || 0,
                totalPayments: revenue[0]?.totalPayments || 0
            },
            "Admin revenue fetched successfully"
        )
    );
})



const getTodayRevenue = asyncHandler( async(req, res) => {

    const start = new Date()
    start.set(0,0,0,0)

    const end = new Date()
    end.set(23,59,59,999)

    const revenue = await Payment.aggregate([
        {
            $match: {
                status: "SUCCESS",
                createdAt: { 
                    $gte: start, 
                    $lte: end 
                }
            }
        },
        {
            $group: {
                _id: null,
                todayRevenue: {
                    $sum: "$amount",
                }
            }
        }
    ])

    return res.status(200).json(
        new APIresponse(
            200,
            { 
                todayRevenue: revenue[0]?.todayRevenue || 0 
            },
            "Today's revenue fetched"
        )
    );

})


const getRevenueByMovie = asyncHandler( async(req, res) => {

    const revenue = await Payment.aggregate([
        {
            $match: {
                status: "SUCCESS",
            }
        },
        {
            $lookup: {
                from: "bookings",
                localField: "bookingId",
                foreignField: "_id",
                as: "booking"
            }
        },
        {
            $unwind: "$booking",
        },
        {
            $lookup: {
                from: "shows",
                localField: "booking.showId",
                foreignField: "_id",
                as: "show"
            }
        },
        {
            $unwind: "$show",
        },
        {
            $lookup: {
                from: "movies",
                localField: "show.movieId",
                foreignField: "_id",
                as: "movie"
            }
        },
        {
            $unwind: "$movie",
        },
        {
            $group: {
                _id: "$movie._id",
                movieName: { 
                    $first: "$movie.title" 
                },
                revenue: { 
                    $sum: "$amount" 
                }
            }
        },
        {
            $project: {
                _id: 0,
                movieName: 1,
                revenue: 1
            }
        }
    ])

    return res.status(200).json(
        new APIresponse(200, revenue, "Revenue by movie fetched")
    );

})

export {
    getAdminTotalRevenue,
    getTodayRevenue,
    getRevenueByMovie,
}