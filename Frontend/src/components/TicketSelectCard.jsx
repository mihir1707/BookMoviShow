import React, { useState } from "react";
import { MoviesShowData } from "../assets/ShowData.js";

function TicketSelectCard({ onClose, onConfirm, seatsType }) {
    const [selected, setSelected] = useState(1);

    const emojiMap = {
        1: "🚲", 2: "🛵", 3: "🛺", 4: "🚕", 5: "🚗", 6: "🚙", 7: "🚐", 8: "🚐", 9: "🚎", 10: "🚎",
    };

    const priceMap = {};
    MoviesShowData[0].screens.forEach(screen => {
        screen.seats.forEach(seat => {
            priceMap[seat.type] = seat.price;
        });
    });

    return (
        <div
            className="fixed inset-0 bg-black/0 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-black w-125 rounded-xl p-6 text-center shadow-sm shadow-gray-500 border-2"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-4">How many seats?</h2>

                <div className="text-4xl m-5">
                    {emojiMap[selected]}
                </div>

                <div className="flex justify-center gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                        <button
                            key={num}
                            onClick={() => setSelected(num)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selected === num ? "bg-primary text-white" : " hover:cursor-pointer"}`}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                <hr className='border m-5'></hr>

                <div className="flex justify-center gap-4 px-4 mb-5">
                    {
                        seatsType.map((type) => (
                            <div key={type} className="text-center">
                                <p className="text-sm">{type}</p>
                                <p className="font-semibold">₹{priceMap[type]}</p>
                                <p className="text-xs text-green-500 font-medium">AVAILABLE</p>
                            </div>
                        ))
                    }
                </div>

                <button
                    className="w-full bg-primary hover:bg-primary-dull text-black py-3 rounded-lg font-semibold cursor-pointer"
                    onClick={() => {
                        onConfirm(selected);
                        onClose();
                    }}
                >
                    Select Seats
                </button>
            </div>
        </div>
    );
}

export default TicketSelectCard;
