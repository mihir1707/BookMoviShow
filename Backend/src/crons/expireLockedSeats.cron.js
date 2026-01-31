import cron from 'node-cron'
import { SeatAvailability } from '../models/seatAvailability.model.js'

const expireLockedSeatsJob = cron.schedule("* * * * *", async() => {
    try{

        const now = new Date()

        const expiredSeats = await SeatAvailability.find({
            status: "LOCKED",
            lockedUntil: {
                $lte: now,
            },
        })

        if(expiredSeats.length === 0) return;

        const bookingIds = expiredSeats.map(seat => seat.bookingId).filter(Boolean)

        await SeatAvailability.updateMany(
            {
                _id: {
                    $in: expiredSeats.map(s => s._id)
                }
            },
            {
                $set: {
                    status: "AVAILABLE",
                    bookingId: null,
                    lockedUntil: null,
                }
            }
        )

        if(bookingIds.length>0){
            await Booking.updateMany(
                {
                    _id: {
                        $in: bookingIds,
                    },
                    bookingStatus: "PENDING",
                },
                {
                    $set: {
                        bookingStatus: "FAILED",
                    }
                }
            )
        }

        console.log(`[CRON] Expired seats released: ${expiredSeats.length}`);

    }
    catch(error){
        console.error("[CRON] expireLockedSeats error:", error);
    }
})

export default expireLockedSeatsJob