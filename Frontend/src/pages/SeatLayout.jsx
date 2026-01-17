import { ChevronLeft, Pencil } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { MoviesDetailsData } from '../assets/MoviesData'
import { MoviesShowData } from '../assets/ShowData'
import TicketSelectCard from '../components/TicketSelectCard'
import Seats from '../components/Seats'
import { dummyDateTimeData } from '../assets/assets.js'


function SeatLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const movie = MoviesDetailsData[Number(id) - 1]

    const [isOpen, setIsOpen] = useState(false)
    const [seatCount, setSeatCount] = useState(1)
    const [show, setShow] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([])

    const getShow = async ()=>{
        const show = MoviesDetailsData.find(movie => movie.id === id)
        if(show){
            setShow({
                movie: show,
                dateTime: dummyDateTimeData,
            })
        }
    }

    useEffect(()=>{
        const load = async () => {
            await getShow()
        }
        load()
    },[id])

    const {
        theaterName = "",
        selectedDateIndex="",
        selectedDateLabel = "",
        selectedTime = "",
        seatType = [],
    } = location.state || {}

    const seatMap = useMemo(() => {
        const map = {}
        MoviesShowData[0].TotalSeats.forEach(item => {
            const [type, count] = item.split('-').map(v => v.trim())
            map[type] = Number(count)
        })
        return map
    }, [])

    const totalAmount = useMemo(() => {
        return selectedSeats.reduce((sum, seat) => {
            return sum + MoviesShowData[0].prices[seat.type]
        }, 0)
    }, [selectedSeats])

    let rowStart = 1

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
                    className="ml-auto flex items-center gap-2 border px-3 py-1 rounded cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <Pencil size={16} />
                    <span>{seatCount} Seats</span>
                </div>
            </div>

            <div className="shadow-lg shadow-gray-800 flex items-center text-sm">
                <span className="rounded m-3 ml-15 p-2 w-20 h-8 flex items-center justify-center bg-green-800">
                    {selectedTime}
                </span>
            </div>

            {isOpen && (
                <TicketSelectCard
                    onClose={() => setIsOpen(false)}
                    onConfirm={(count) => {
                        setSeatCount(count)
                        setSelectedSeats([])
                    }}
                    seatsType={seatType}
                />
            )}

            <div className="flex flex-col gap-8 mt-10 text-white">
                {[...seatType].reverse().map((type, index) => {
                    const totalSeats = seatMap[type]
                    if (!totalSeats) return null

                    const StructureSeats = [
                        [3,4,3],
                        [4,5,5,4],
                        [3,4,3,4],
                        [5,5,5,5,5],
                    ]

                    const startRow = rowStart + Math.ceil(totalSeats / 10)

                    return (
                        <div key={type}>
                            <p className="text-center mb-3 font-semibold">
                                {type} — ₹{MoviesShowData[0].prices[type]}
                            </p>

                            <Seats
                                seatCount={totalSeats}
                                selectedSeats={selectedSeats}
                                setSelectedSeats={setSelectedSeats}
                                SeatsStructure={StructureSeats[index % StructureSeats.length]}
                                rowId={startRow}
                                selectedSeatCount={seatCount}
                                seatType={type}
                            />
                        </div>
                    )
                })}
            </div>

            <div className="mt-12 flex flex-col items-center text-white">
                <div className="relative w-72 h-5">
                    <div
                        className="absolute inset-0 bg-white/70 rounded-t-full shadow-md"
                        style={{
                            transform: 'perspective(200px) rotateX(25deg) scaleX(1.2)',
                        }}
                    />
                    <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-2 bg-white/30 rounded-b-full"
                        style={{
                            transform: 'perspective(200px) rotateX(25deg) scaleX(1.1)',
                        }}
                    />
                </div>
                <p className="text-xs mt-3 tracking-widest">SCREEN</p>
            </div>

            {selectedSeats.length === seatCount && (
                <div className="fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-center z-50">
                    <button
                        onClick={()=>{
                            navigate(`/movie/${show.movie.id}/theater/food`,
                                {
                                    state: {
                                        id,
                                        theaterName: "PVR Cinemas",
                                        selectedDateIndex,
                                        selectedDateLabel,
                                        selectedTime,
                                        seatType
                                    }
                                }
                            )
                        }}
                        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg font-semibold">
                        Pay ₹{totalAmount}
                    </button>
                </div>
            )}
        </>
    )
}

export default SeatLayout
