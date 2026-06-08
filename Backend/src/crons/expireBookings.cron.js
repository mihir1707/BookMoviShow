import cron from "node-cron";
import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Payment } from "../models/payment.model.js";

const expireBookingsJob = cron.schedule(
    "* * * * *",
    async () => {
        if (mongoose.connection.readyState !== 1) {
            console.warn('[CRON] expireBookings skipped: DB not connected');
            return;
        }
        try {
            const expiredBookings = await Booking.find({
                bookingStatus: "PENDING",
                expiresAt: { $lt: new Date() },
            });

            for (const booking of expiredBookings) {
                booking.bookingStatus = "EXPIRED";
                booking.expiresAt = null;
                await booking.save();

                await Payment.updateMany(
                    {
                        bookingId: booking._id,
                        status: "CREATED",
                    },
                    {
                        $set: { status: "FAILED" },
                    }
                );
            }

            if (expiredBookings.length > 0) {
                console.log(
                    `Expired ${expiredBookings.length} unpaid bookings`
                );
            }

        } catch (error) {
            console.error(
                "Error while expiring bookings:",
                error.message
            );
        }
    },
    {
        scheduled: true,
    }
);

export default expireBookingsJob;
