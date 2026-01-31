import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { MoviesShowData } from "../assets/ShowData.js";

function Payment() {

    const location = useLocation();

    const {
        movieTitle,
        theaterName,
        selectedDateLabel,
        selectedTime,
        screenNo,
        selectedSeats = [],
        totalAmount,
    } = location.state || {};

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


    const [method, setMethod] = useState("credit");

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

                <div className="flex flex-col space-y-4 bg-gray-950">
                    <div className="rounded-lg p-4 flex justify-between font-semibold">
                        <span>To be Paid:</span>
                        <span>₹726.36</span>
                    </div>

                    <div className="rounded-xl p-6">

                        {/* CREDIT / DEBIT CARD */}
                        {(method === "credit" || method === "debit") && (
                            <>
                                <h3 className="font-semibold mb-4">
                                    Pay via {method === "credit" ? "Credit Card" : "Debit Card"}
                                </h3>

                                <input
                                    className="w-full border rounded-lg p-3 mb-4"
                                    placeholder="Enter Card Number"
                                />

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <input className="border rounded-lg p-3" placeholder="MM" />
                                    <input className="border rounded-lg p-3" placeholder="YY" />
                                    <input className="border rounded-lg p-3" placeholder="CVV" />
                                </div>

                                <input
                                    className="w-full border rounded-lg p-3 mb-4"
                                    placeholder="Name on the card"
                                />

                                <label className="flex items-center gap-2 text-sm mb-6">
                                    <input type="checkbox" />
                                    Securely save this card for future use
                                </label>

                                <button className="w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg">
                                    Verify & Pay
                                </button>
                            </>
                        )}

                        {/* UPI */}
                        {method === "upi" && (
                            <>
                                <h3 className="font-semibold mb-4">UPI</h3>

                                <input
                                    className="w-full border rounded-lg p-3 mb-4"
                                    placeholder="UPI ID"
                                />

                                <button className="w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg">
                                    Verify & Pay
                                </button>

                                <p className="text-xs text-gray-400 mt-2">
                                    A collect request notification will be sent to this UPI ID
                                </p>
                            </>
                        )}

                        {/* NET BANKING */}
                        {method === "netbanking" && (
                            <>
                                <h3 className="font-semibold mb-4">Net Banking</h3>

                                <select className="w-full border rounded-lg p-3 mb-4 text-white">
                                    <option className='text-black'>Select Bank</option>
                                    <option className='text-black'>HDFC Bank</option>
                                    <option className='text-black'>ICICI Bank</option>
                                    <option className='text-black'>SBI</option>
                                    <option className='text-black'>Axis Bank</option>
                                </select>

                                <label className="flex items-center gap-2 text-sm mb-4">
                                    <input type="checkbox" />
                                    I have read and accepted the{" "}
                                    <span className="underline cursor-pointer">
                                        Terms & Conditions
                                    </span>
                                </label>

                                <button className="w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg">
                                    Pay
                                </button>
                            </>
                        )}

                        {/* GIFT CARD */}
                        {method === "gift" && (
                            <>
                                <h3 className="font-semibold mb-4">Gift Card</h3>

                                <input
                                    className="w-full border rounded-lg p-3 mb-4"
                                    placeholder="Enter Card Number"
                                />

                                <input
                                    className="w-full border rounded-lg p-3 mb-4"
                                    placeholder="Enter PIN"
                                />

                                <p className="text-xs text-gray-400 mb-4">
                                    Gift card will not be refunded for cancellation
                                </p>

                                <button className="w-full bg-amber-200 hover:bg-amber-300 text-black font-bold py-3 rounded-lg">
                                    Apply
                                </button>
                            </>
                        )}

                    </div>

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
                        {/* <div className="flex gap-2 mt-2">
                            {selectedSeats.map(seat => (
                                <span
                                    key={seat.id || seat.label}
                                    className="bg-amber-200 text-black px-3 py-1 rounded-md text-sm"
                                >
                                    {seat.label || seat.seatNo}
                                </span>
                            ))}
                        </div> */}
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


                    {/* <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                            <span>Net Price (3 Tickets)</span>
                            <span>₹508.44</span>
                        </div>
                        <div className="flex justify-between">
                            <span>GST</span>
                            <span>₹91.56</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>Total Ticket Price</span>
                            <span>₹600.00</span>
                        </div>
                    </div> */}

                    {/* <div className="flex justify-between text-sm">
                        <span>Taxes & Fees</span>
                        <span>₹120.36</span>
                    </div> */}

                    <div className="flex justify-between font-bold text-base border-t pt-3">
                        <span>To be Paid</span>
                        <span>₹{totalAmount}</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Payment
