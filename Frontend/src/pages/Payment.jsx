import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { MoviesShowData } from "../assets/ShowData.js";
import axios from "axios";

function Payment() {

    const location = useLocation();
    const navigate = useNavigate();

    const {
        bookingId,
        movieTitle,
        theaterName,
        selectedDateLabel,
        selectedTime,
        screenNo,
        selectedSeats = [],
        totalAmount,
    } = location.state || {};

    const [method, setMethod] = useState("credit");
    const [loading, setLoading] = useState(false);

    if (!location.state || !bookingId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>No booking data found. Please select seats again.</p>
            </div>
        );
    }

    const screenData = MoviesShowData[0]?.screens?.find(
        s => s.screenNo === screenNo
    );

    const seatTypeSummary = selectedSeats.reduce((acc, seat) => {
        const type = seat.type;

        if (!acc[type]) {
            acc[type] = {
                count: 0,
                seats: [],
            };
        }

        acc[type].count += 1;
        acc[type].seats.push(seat.label || seat.seatNo);
        return acc;
    }, {});

    const getSeatPrice = (type) => {
        const seat = screenData?.seats?.find(s => s.type === type);
        return seat?.price || 0;
    };


    const handlePayment = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login again");
                return;
            }

            const orderRes = await axios.post(
                "http://localhost:8000/api/v1/razorpay/create-order",
                { bookingId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { key, orderId, amount, currency } = orderRes.data.data;

            const options = {
                key,
                amount,
                currency,
                name: "Movie Ticket Booking",
                description: "Ticket Payment",
                order_id: orderId,

                handler: async function (response) {
                    try {
                        await axios.post(
                            "http://localhost:8000/api/v1/razorpay/verify",
                            {
                                bookingId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        alert("Payment Successful 🎉");
                        navigate("/my-bookings");
                    } catch (err) {
                        alert(
                            err?.response?.data?.message ||
                            "Payment verification failed"
                        );
                    }
                },

                theme: {
                    color: "#f59e0b",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            alert(error?.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-black p-5">
            <div className='grid grid-cols-[260px_1fr_320px] gap-5'>

                <div className='rounded-lg p-4 space-y-4 bg-gray-950 border-2 border-primary'>
                    <div>
                        <h4 className="text-sm font-semibold mb-2 p-2">OFFERS & PROMOTIONS</h4>
                        <ul className="space-y-2 text-sm pb-2">
                            <li className="cursor-pointer p-1">🏦 Bank Offers</li>
                            <li className="cursor-pointer p-1">⭐ Star Pass</li>
                            <li className="cursor-pointer p-1">🎟️ M-Coupon</li>
                            <li className="cursor-pointer p-1">🏷️ Promocode</li>
                            <li className="cursor-pointer p-1">👑 Privilege Plus</li>
                        </ul>
                    </div>
                    <hr></hr>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">PAYMENT METHODS</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                ["credit", "💳 Credit Card"],
                                ["debit", "💳 Debit Card"],
                                ["netbanking", "🏦 Net Banking"],
                                ["upi", "📱 UPI"],
                                ["gift", "🎁 Gift Card"],
                            ].map(([key, label]) => (
                                <li
                                    key={key}
                                    onClick={() => setMethod(key)}
                                    className={`cursor-pointer rounded-md p-2 ${method === key
                                        ? "bg-amber-200 font-semibold text-black"
                                        : "hover:bg-amber-100 hover:text-black"
                                        }`}
                                >
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="bg-gray-950 rounded-xl p-6">
                    <h3 className="font-semibold mb-4 capitalize">
                        Pay via {method.replace("_", " ")}
                    </h3>

                    <button
                        disabled={loading}
                        onClick={handlePayment}
                        className="cursor-pointer w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg disabled:opacity-60"
                    >
                        {loading ? "Processing..." : `Verify & Pay ₹${totalAmount}`}
                    </button>

                    <p className="text-xs text-gray-400 mt-3">
                        This is a demo payment flow. No real money is charged.
                    </p>
                </div>

                <div className="bg-gray-950 rounded-xl p-4 space-y-4">
                    <h3 className="font-semibold">Booking Summary</h3>

                    <div>
                        <p className="font-semibold text-sm">
                            {movieTitle}
                        </p>
                        <p className="text-xs mt-5">
                            {selectedDateLabel}, {selectedTime}
                        </p>
                        <p className="text-xs">
                            {theaterName}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-sm mb-1">Seat Info</p>
                        <p className="text-sm">SCREEN {screenNo}</p>
                    </div>

                    <div className="text-sm space-y-2 border-t pt-3">
                        {Object.entries(seatTypeSummary).map(([type, data]) => {
                            const price = getSeatPrice(type);
                            const total = price * data.count;

                            return (
                                <div key={type} className="space-y-1">
                                    <div className="flex justify-between font-medium">
                                        <span>
                                            {type} ₹{price} x {data.count}
                                        </span>
                                        <span>₹{total}</span>
                                    </div>

                                    <p className="text-xs text-gray-400">
                                        Seats: {data.seats.join(", ")}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between font-semibold border-t pt-3">
                        <span>Total</span>
                        <span>₹{totalAmount}</span>
                    </div>

                </div>

            </div >
        </div >
    )
}

export default Payment
