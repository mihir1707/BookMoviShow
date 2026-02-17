import cron from 'node-cron'
import mongoose from 'mongoose'
import { Booking } from "../models/booking.model.js";

const expireLockedSeatsJob = cron.schedule("* * * * *", async() => {
    if (mongoose.connection.readyState !== 1) {
        console.warn('[CRON] expireLockedSeats skipped: DB not connected');
        return;
    }
    try{
        const now = new Date()
        const expiredBookings = await Booking.updateMany(
            {
                bookingStatus: "PENDING",
                expiresAt: { $lte: now },
            },
            {
                $set: {
                    bookingStatus: "FAILED",
                },
            }
        );
        if (expiredBookings.modifiedCount > 0) {
            console.log(
                `[CRON] Expired bookings marked as FAILED: ${expiredBookings.modifiedCount}`
            );
        }
    }
    catch(error){
        console.error("[CRON] expireLockedSeats error:", error);
    }
})

export default expireLockedSeatsJob