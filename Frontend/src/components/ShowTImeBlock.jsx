import React from 'react'
import { MoviesShowData } from '../assets/ShowData'
import { useNavigate } from 'react-router-dom'

function ShowTImeBlock({ time, id, selectedDateIndex, selectedDateLabel }) {

    const navigate = useNavigate()

    const seatType = MoviesShowData[0].seatsTypes[0] || ["SLIVER", "GOLD", "PLATINUM"]

    return (
        <div className="relative group flex border-2 border-green-500 text-green-600 w-35 h-12.5 justify-center items-center rounded-md cursor-pointer p-3 ml-5"
            onClick={
                () => {
                    navigate(`/movie/${id}/theater/seat-layout`,
                        {
                            state: {
                                id,
                                theaterName: "PVR Cinemas",
                                selectedDateIndex,
                                selectedDateLabel,
                                selectedTime: time,
                                seatType
                            }
                        }
                    )
                    window.scroll(0,0)
                }
            }
        >

            {time}

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-white shadow-xl rounded-lg p-4 gap-6 z-50">

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>

                <div className='flex gap-5'>
                    {
                        seatType.map((type)=>{
                            const price = MoviesShowData[0].prices[type] || 280
                            const isFastFilling = 0
                            return (
                                <div key={type} className="text-center">
                                    <p className="text-sm text-black font-semibold">
                                        ₹{price.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-black whitespace-nowrap">
                                        {type}
                                    </p>
                                    <p className={`text-xs font-medium ${isFastFilling ? 'text-orange-400' : 'text-green-600'}`}>
                                        {isFastFilling ? 'FILLING FAST' : 'AVAILABLE'}
                                    </p>
                                </div>
                            )
                        })
                    }
                </div>

            </div>
        </div>

    )
}

export default ShowTImeBlock
