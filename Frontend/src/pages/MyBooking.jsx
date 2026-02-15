import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading.jsx";
import timeFormat from "../lib/timeFormat.js";
import { dateFormat } from "../lib/dateFormat.js";

function MyBooking() {

    const currency = import.meta.env.VITE_CURRENCY;

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMyBookings = async () => {
        try {
            const res = await axios.get(
                "http://localhost:8000/api/v1/booking/myBooking",
                { withCredentials: true }
            );

            setBookings(res.data.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getMyBookings();
    }, []);

    if (isLoading) return <Loading />;

    return (
        <div className="relative px-3 sm:px-6 md:px-16 lg:px-40 pt-20 sm:pt-30 md:pt-40 min-h-[80vh]">
            <h1 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">My Bookings</h1>

            {bookings.length === 0 && (
                <p className="text-gray-400 text-sm">No bookings found.</p>
            )}

            {bookings.map((item) => {
                const seatNumbers = item.seats.map(s => s.seatNumber).join(", ");

                return (
                    <div
                        key={item._id}
                        className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-3 sm:mt-4 p-2 sm:p-3 max-w-3xl"
                    >
                        <div className="flex flex-col md:flex-row">
                            <img
                                src={item.movieId?.poster_path}
                                alt={item.movieId?.title}
                                className="md:max-w-45 aspect-video h-auto object-cover object-bottom rounded w-full md:w-auto"
                            />

                            <div className="flex flex-col p-2 sm:p-4">
                                <p className="text-base sm:text-lg font-semibold line-clamp-2">
                                    {item.movieId?.title}
                                </p>

                                <p className="text-gray-400 text-xs sm:text-sm">
                                    {timeFormat(item.movieId?.runtime)}
                                </p>

                                <p className="text-gray-400 text-xs sm:text-sm mt-auto">
                                    {dateFormat(item.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-end md:text-right justify-between p-2 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <p className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-3">
                                    {currency}{item.totalAmount}
                                </p>

                                {item.bookingStatus === "PENDING" && (
                                    <button className="bg-primary px-3 sm:px-4 py-1 mb-2 sm:mb-3 text-xs sm:text-sm rounded-full font-medium cursor-pointer whitespace-nowrap">
                                        Pay Now
                                    </button>
                                )}
                            </div>

                            <div className="text-xs sm:text-sm">
                                <p>
                                    <span className="text-gray-400">
                                        Total Tickets:
                                    </span>{" "}
                                    {item.seatCount}
                                </p>

                                <p>
                                    <span className="text-gray-400">
                                        Seat Number:
                                    </span>{" "}
                                    <span className='line-clamp-2'>{seatNumbers}</span>
                                </p>

                                <p>
                                    <span className="text-gray-400">
                                        Status:
                                    </span>{" "}
                                    {item.bookingStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default MyBooking;
