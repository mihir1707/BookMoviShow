import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading.jsx";
import timeFormat from "../lib/timeFormat.js";
import { dateFormat } from "../lib/dateFormat.js";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

function MyBooking() {
    const navigate = useNavigate();

    const currency = import.meta.env.VITE_CURRENCY;

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    const getMyBookings = async () => {
        try {
            const res = await axios.get(
                `${baseUrl}/booking/myBooking`,
                { withCredentials: true }
            );

            setBookings(res.data.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        
        try {
            await axios.patch(
                `${baseUrl}/booking/${bookingId}/cancel`, 
                {}, 
                { withCredentials: true }
            );
            alert("Booking cancelled successfully");
            getMyBookings(); // refresh list
        } catch (error) {
            console.error("Cancel failed", error);
            alert(error.response?.data?.message || "Failed to cancel booking");
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {bookings.map((item) => {
                    const seatNumbers = item.seats.map(s => s.seatNumber).join(", ");
                    const isConfirmed = item.bookingStatus === "CONFIRMED";
                    const isPending = item.bookingStatus === "PENDING";

                    return (
                        <div
                            key={item._id}
                            className="flex flex-col sm:flex-row bg-black border border-primary/20 hover:border-primary/40 transition-colors rounded-xl overflow-hidden shadow-lg shadow-primary/5"
                        >
                            {/* Left Side: Movie Details */}
                            <div className="flex flex-col sm:flex-row flex-1 p-4 gap-4 bg-primary/5">
                                <img
                                    src={item.movieId?.posterUrl}
                                    alt={item.movieId?.title}
                                    className="w-24 sm:w-28 h-auto object-cover rounded-lg shadow-md aspect-[2/3]"
                                />
                                <div className="flex flex-col">
                                    <h2 className="text-lg sm:text-xl font-bold text-white line-clamp-2">
                                        {item.movieId?.title}
                                    </h2>
                                    <p className="text-gray-400 text-xs sm:text-sm mt-1 mb-3">
                                        {item.theatreId?.name || "Theater details not available"}
                                    </p>
                                    
                                    <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm">
                                        <div>
                                            <p className="text-primary/70 text-[10px] uppercase tracking-wider">Date & Time</p>
                                            <p className="font-medium text-gray-200">{item.showDate} | {item.showTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-primary/70 text-[10px] uppercase tracking-wider">Screen</p>
                                            <p className="font-medium text-gray-200">Screen {item.screenNo}</p>
                                        </div>
                                        <div>
                                            <p className="text-primary/70 text-[10px] uppercase tracking-wider">Tickets ({item.seatCount})</p>
                                            <p className="font-medium text-primary line-clamp-1">{seatNumbers}</p>
                                        </div>
                                        <div>
                                            <p className="text-primary/70 text-[10px] uppercase tracking-wider">Total Amount</p>
                                            <p className="font-medium text-white">{currency}{item.totalAmount}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: QR Code & Status */}
                            <div className="relative flex flex-col items-center justify-center p-5 border-t sm:border-t-0 sm:border-l border-dashed border-primary/30 bg-primary/10 min-w-[140px]">
                                {/* Cutouts for the ticket look */}
                                <div className="hidden sm:block absolute -top-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                                <div className="hidden sm:block absolute -bottom-3 -left-3 w-6 h-6 bg-black rounded-full"></div>
                                
                                <span className={`text-[10px] font-bold tracking-widest px-2 py-1 rounded mb-3 ${
                                    isConfirmed ? 'bg-green-500/20 text-green-500' : 
                                    isPending ? 'bg-orange-500/20 text-orange-500' : 'bg-red-500/20 text-red-500'
                                }`}>
                                    {item.bookingStatus}
                                </span>

                                {isConfirmed ? (
                                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                        <QRCodeSVG 
                                            value={JSON.stringify({
                                                id: item._id,
                                                code: item.bookingCode
                                            })} 
                                            size={80} 
                                        />
                                    </div>
                                ) : isPending ? (
                                    <button 
                                        onClick={() => navigate('/payment', {
                                            state: {
                                                bookingId: item._id,
                                                movieTitle: item.movieId?.title,
                                                theaterName: item.theatreId?.name,
                                                selectedDateLabel: item.showDate,
                                                selectedTime: item.showTime,
                                                screenNo: item.screenNo,
                                                selectedSeats: item.seats,
                                                totalAmount: item.totalAmount
                                            }
                                        })}
                                        className="bg-primary hover:bg-primary-dull text-black px-4 py-2 w-full text-sm rounded-full font-bold transition-colors shadow-lg shadow-primary/20"
                                    >
                                        Pay Now
                                    </button>
                                ) : (
                                    <div className="w-20 h-20 flex items-center justify-center opacity-20">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                )}
                                
                                {isConfirmed && (
                                    <p className="text-[9px] text-gray-500 mt-2 text-center uppercase">
                                        Scan at entrance
                                    </p>
                                )}

                                {(isConfirmed || isPending) && (
                                    <button 
                                        onClick={() => cancelBooking(item._id)}
                                        className="mt-4 text-[10px] text-red-500 hover:text-red-400 uppercase tracking-wider font-semibold border border-red-500/30 hover:border-red-500 px-3 py-1 rounded-full transition-colors bg-transparent cursor-pointer"
                                    >
                                        Cancel Ticket
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MyBooking;
