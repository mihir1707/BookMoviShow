import cron from "node-cron";
import { Booking } from "../models/booking.model.js";

const expireBookingsJob = cron.schedule(
    "* * * * *",
    async () => {
        try {
            const result = await Booking.updateMany(
                {
                    bookingStatus: "PENDING",
                    expiresAt: { $lt: new Date() },
                },
                {
                    $set: { bookingStatus: "EXPIRED" },
                }
            );

            if (result.modifiedCount > 0) {
                console.log(
                    `Expired ${result.modifiedCount} unpaid bookings`
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
        scheduled: false,
    }
);

export default expireBookingsJob;
