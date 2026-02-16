import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DateSelector from '../components/DateSelector'
import ShowCard from '../components/ShowCard'
import axios from 'axios'

function TheaterList() {

    const { id } = useParams()

    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedDateLabel, setSelectedDateLabel] = useState(() => {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, "0")
        const dd = String(today.getDate()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`
    })

    const [nowShowingMovies, setNowShowingMovies] = useState([])
    const [location, setLocation] = useState(null)
    const [theater, setTheater] = useState([])

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("Location detected:", pos.coords)
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
            },
            (err) => {
                console.error("Geolocation error:", err.message)
                setLocation({ lat: 23.0269, lng: 72.5872 })
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )
    }, [])



    useEffect(() => {
        axios.get(`${baseUrl}/movies/now-showing`)
            .then(res => setNowShowingMovies(res.data.data || []))
            .catch((error) => {
                console.log("Now Showing Movies data fetch error", error)
                setNowShowingMovies([])
            })
    }, [])

    const movie = nowShowingMovies.find(
        (m) => String(m._id) === String(id)
    )

    useEffect(() => {
        if(!location){
            console.log("Select a location")
            return
        }
        axios.get(`${baseUrl}/theatres/nearby`, {
            params: {
                lat: location.lat,
                lng: location.lng,
            }
        })
        .then((res) => {
            setTheater(res.data.data || [])
        })
        .catch((err) => {
            console.error("Nearby theatres fetch error", err);
            setTheater([]);
        });
    },[location])

    if (!movie) {
        return <div className="mt-30">Not Available Movie</div>
    }


    return (
        <div className='mt-20 sm:mt-30 mb-10 sm:mb-20 px-3 sm:px-6 md:px-10 lg:px-15'>
            <hr className='border text-gray-700' />

            <div className='m-2 sm:m-5 ml-3 sm:ml-15'>
                <p className='text-2xl sm:text-3xl md:text-4xl mb-2'>{movie.title}</p>

                <div className='flex flex-wrap gap-2'>
                    <span className='text-white text-xs sm:text-sm rounded-full border-gray-300 border pl-2 pr-2 pb-0.5'>
                        {`Movie runtime: ${movie.runtime ? movie.runtime : "—"}`}
                    </span>

                    <span className='text-white text-xs sm:text-sm rounded-full border-gray-300 border pl-2 pr-2 pb-0.5'>
                        {movie.censorRating}
                    </span>

                    {movie.genres.map((g) => (
                        <span
                            key={g}
                            className='text-white text-xs sm:text-sm rounded-full border-gray-300 border pl-2 pr-2 pb-0.5'
                        >
                            {g}
                        </span>
                    ))}
                </div>
            </div>

            <hr className='border text-gray-700' />

            <div className='m-3 sm:m-5 ml-3 sm:ml-15'>
                <DateSelector
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setSelectedDateLabel={setSelectedDateLabel}
                />
            </div>

            <hr className='border text-gray-700 shadow-sm shadow-gray-700' />

            <div className='m-3 sm:m-4 flex flex-wrap justify-end gap-3 sm:gap-5'>
                <p className='text-xs sm:text-sm'>
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full inline-block"></span>
                    AVAILABLE
                </p>
                <p className='text-xs sm:text-sm'>
                    <span className="w-2 h-2 mr-1 bg-orange-400 rounded-full inline-block"></span>
                    FAST FILLING
                </p>
            </div>

            <hr className='border text-gray-700' />

            <div className='m-3 sm:m-5 ml-3 sm:ml-10'>
                <ShowCard
                    theaters={theater}
                    id={String(id)}
                    selectedDateIndex={selectedDate}
                    selectedDateLabel={selectedDateLabel}
                />
            </div>
        </div>
    )
}

export default TheaterList
