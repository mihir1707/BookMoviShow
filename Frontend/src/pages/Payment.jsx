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
        setLoading(true);

        try{
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("Please login again");
                setLoading(false);
                return;
            }

            await axios.post(
                "http://localhost:8000/api/v1/payments",
                {
                    bookingId,
                    paymentMethod: "razorpay",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const orderRes = await axios.post(
                "http://localhost:8000/api/v1/razorpay/create-order",
                { 
                    bookingId 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const { key, orderId, amount, currency } = orderRes.data.data;

            if (!window.Razorpay) {
                alert("Razorpay SDK not loaded");
                setLoading(false);
                return;
            }

            const options = {
                key,
                amount,
                currency,
                name: "Movie Ticket Booking",
                description: "Ticket Payment",
                order_id: orderId,

                handler: async function (response) {
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
                },
                theme: { color: "#f59e0b" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
        catch (error) {
            alert(error?.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-5">
            <div className="w-full max-w-md border-2 rounded-xl">

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

                                    <p className="text-xs">
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

                    <button
                        disabled={loading}
                        onClick={handlePayment}
                        className="cursor-pointer w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg disabled:opacity-60"
                    >
                        {loading ? "Processing..." : `Verify & Pay ₹${totalAmount}`}
                    </button>

                </div>

            </div >
        </div >
    )
}

export default Payment
