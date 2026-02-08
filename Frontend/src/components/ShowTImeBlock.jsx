import React from 'react'
import { useNavigate } from 'react-router-dom'

function ShowTImeBlock({ time, theatreId, screenNo, theaterName, id, selectedDateIndex, selectedDateLabel, seats = [] }) {

    const navigate = useNavigate()

    return (
        <div
            className="relative group flex border-2 border-green-500 text-green-600 w-35 h-12.5 justify-center items-center rounded-md cursor-pointer p-3 ml-5"
            onClick={() => {
                navigate(`/movie/${id}/${encodeURIComponent(theaterName)}/seat-layout`, {
                    state: {
                        id,
                        showId: `${id}-${time}`,
                        screenNo,
                        theaterName,
                        theatreId,
                        selectedDateIndex,
                        selectedDateLabel,
                        selectedTime: time,
                        seatType: seats.map(s => s.type)
                    }
                })
                window.scroll(0, 0)
            }}
        >

            {time}

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-black border-2 border-primary text-white shadow-xl rounded-lg p-4 gap-6 z-50">

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-b-2 border-r-2 border-primary rotate-45"></div>

                <div className='flex gap-5'>
                    {seats.map((seat) => {

                        const isFastFilling = false

                        return (
                            <div key={seat.type} className="text-center">
                                <p className="text-sm font-semibold">
                                    ₹{seat.price.toFixed(2)}
                                </p>
                                <p className="text-xs whitespace-nowrap">
                                    {seat.type}
                                </p>
                                <p className={`text-xs font-medium ${isFastFilling ? 'text-orange-400' : 'text-green-600'}`}>
                                    {isFastFilling ? 'FILLING FAST' : 'AVAILABLE'}
                                </p>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

export default ShowTImeBlock
