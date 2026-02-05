import { ChevronLeft, Pencil } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { MoviesShowData } from '../assets/ShowData.js'
import TicketSelectCard from '../components/TicketSelectCard'
import Seats from '../components/Seats'

function SeatLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    const {
        theaterName = "",
        selectedDateLabel = "",
        selectedTime = "",
        seatType = [],
        screenNo,
        theatreId,
    } = location.state || {}

    const decodedTheaterName = decodeURIComponent(theaterName)

    const [movieTitle, setMovieTitle] = useState("")
    const [isOpen, setIsOpen] = useState(true)
    const [seatCount, setSeatCount] = useState(1)
    const [selectedSeats, setSelectedSeats] = useState([])
    const [lockedSeats, setLockedSeats] = useState([]);

    const createBooking = async () => {
        try {
            const token = localStorage.getItem("accessToken");

            console.log("TOKEN:", token);

            if (!token) {
                alert("Please login to continue booking")
                navigate("/login")
                return
            }

            const formattedSeats = selectedSeats.map(seat => ({
                seatNumber: seat.seatNo,
                seatType: seat.type,
                price: getSeatPrice(seat.type),
            }));

            const res = await axios.post(
                "http://localhost:8000/api/v1/booking",
                {
                    movieId: id,
                    theatreId: theatreId,
                    screenNo: screenNo,
                    showTime: selectedTime,
                    showDate: selectedDateLabel,
                    seats: formattedSeats,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/payment", {
                state: {
                    bookingId: res.data.data._id,
                    movieTitle,
                    theaterName: decodedTheaterName,
                    selectedDateLabel,
                    selectedTime,
                    screenNo,
                    selectedSeats,
                    totalAmount,
                },
            })

        }
        catch (error) {
            alert(error.response?.data?.message || "Booking failed");
        }
    }

    useEffect(() => {
        const fetchLockedSeats = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/v1/booking/locked-seats`,
                    {
                        params: {
                            movieId: id,
                            theatreId,
                            screenNo,
                            showTime: selectedTime,
                            showDate: selectedDateLabel,
                        },
                    }
                );

                console.log(res.data)

                setLockedSeats(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch locked seats", err);
            }
        };

        if(id && theatreId && screenNo && selectedTime && selectedDateLabel) {
            fetchLockedSeats();
        }
    }, [id, theatreId, screenNo, selectedTime, selectedDateLabel]);


    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/v1/movies/${id}`)
            .then(res => {
                setMovieTitle(res.data?.data?.title || "")
            })
            .catch(err => {
                console.error("Movie fetch error", err)
            })
    }, [id])


    const screen = useMemo(() => {
        return MoviesShowData?.[0]?.screens?.find(
            s => s.screenNo === screenNo
        )
    }, [screenNo])

    if (!screen) {
        return (
            <div className="mt-30 text-white text-center">
                Invalid Screen Selected
            </div>
        )
    }

    const seatMap = useMemo(() => {
        const map = {}
        screen.seats.forEach(seat => {
            map[seat.type] = seat.total
        })
        return map
    }, [screen])

    const getSeatPrice = (type) => {
        const seat = screen.seats.find(s => s.type === type)
        return seat ? seat.price : 0
    }

    const totalAmount = useMemo(() => {
        return selectedSeats.reduce(
            (sum, seat) => sum + getSeatPrice(seat.type),
            0
        )
    }, [selectedSeats, screen])

    let globalRowIndex = 0

    return (
        <>
            {/* Header */}
            <div className="p-3 flex gap-5 items-center shadow-lg/15 shadow-gray-50">
                <ChevronLeft
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => navigate(-1)}
                />

                <div>
                    <p className="font-bold">
                        {movieTitle || "Loading..."}
                    </p>
                    <p className="text-sm">
                        {decodedTheaterName} | {selectedDateLabel} | {selectedTime}
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

            {/* Time */}
            <div className="shadow-lg shadow-gray-800 flex items-center text-sm">
                <span className="rounded m-3 ml-15 p-2 w-20 h-8 flex items-center justify-center bg-green-800">
                    {selectedTime}
                </span>
            </div>

            {/* Seat count popup */}
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

            {/* Seats */}
            <div className="flex flex-col gap-8 mt-10 text-white">
                {[...seatType].reverse().map((type, index) => {
                    const totalSeats = seatMap[type]
                    if (!totalSeats) return null

                    const StructureSeats = [
                        [3, 4, 3],
                        [4, 5, 5, 4],
                        [3, 4, 3, 4],
                        [5, 5, 5, 5, 5],
                    ]

                    const structure = StructureSeats[index % StructureSeats.length]
                    const seatsPerRow = structure.reduce((a, b) => a + b, 0)
                    const rowsUsed = Math.ceil(totalSeats / seatsPerRow)

                    const startRow = globalRowIndex
                    globalRowIndex += rowsUsed

                    return (
                        <div key={type}>
                            <p className="text-center mb-3 font-semibold">
                                {type} — ₹{getSeatPrice(type)}
                            </p>

                            <Seats
                                seatCount={totalSeats}
                                selectedSeats={selectedSeats}
                                setSelectedSeats={setSelectedSeats}
                                SeatsStructure={structure}
                                selectedSeatCount={seatCount}
                                seatType={type}
                                startRowIndex={startRow}
                                lockedSeats={lockedSeats}
                            />
                        </div>
                    )
                })}
            </div>

            {/* Screen */}
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

            {/* Pay */}
            {selectedSeats.length === seatCount && (
                <div className="fixed bottom-0 left-0 right-0 bg-black p-4 flex justify-center z-50">
                    <button
                        className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-lg font-semibold"
                        onClick={createBooking}
                    >
                        Pay ₹{totalAmount}
                    </button>

                </div>
            )}
        </>
    )
}

export default SeatLayout
