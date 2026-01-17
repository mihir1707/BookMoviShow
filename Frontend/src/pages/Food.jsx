import { ChevronLeft } from 'lucide-react'
import React, { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { MoviesDetailsData } from '../assets/MoviesData'

function Food() {

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const movie = MoviesDetailsData[Number(id) - 1]

    const {
        theaterName = "",
        selectedDateLabel = "",
        selectedTime = "",
        seatType = [],
    } = location.state || {}

    return (
        <>
            <div className="p-3 flex gap-5 items-center shadow-lg/15 shadow-gray-50">
                <ChevronLeft
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => navigate(-1)}
                />

                <div>
                    <p className="font-bold">{movie?.title}</p>
                    <p className="text-sm">
                        {theaterName} | {selectedDateLabel} | {selectedTime}
                    </p>
                </div>

                <div
                    className="ml-auto flex items-center gap-2 border px-3 py-1 rounded bg-primary cursor-pointer w-15"
                >
                    <span>Skip</span>
                </div>

            </div>
        </>
    )
}

export default Food