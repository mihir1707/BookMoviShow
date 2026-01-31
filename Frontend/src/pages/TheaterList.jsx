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
        axios.get("http://localhost:8000/api/v1/movies/now-showing")
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
        axios.get("http://localhost:8000/api/v1/theatres/nearby", {
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
        <div className='mt-30 mb-20'>
            <hr className='border text-gray-700' />

            <div className='m-5 ml-15'>
                <p className='text-4xl mb-2'>{movie.title}</p>

                <span className='text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'>
                    {`Movie runtime: ${movie.runtime ? movie.runtime : "—"}`}
                </span>

                <span className='ml-5 text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'>
                    {movie.censorRating}
                </span>

                {movie.genres.map((g) => (
                    <span
                        key={g}
                        className='ml-5 text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'
                    >
                        {g}
                    </span>
                ))}
            </div>

            <hr className='border text-gray-700' />

            <div className='m-5 ml-15'>
                <DateSelector
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setSelectedDateLabel={setSelectedDateLabel}
                />
            </div>

            <hr className='border text-gray-700 shadow-sm shadow-gray-700' />

            <div className='m-4 flex flex-row justify-end gap-5'>
                <p className='text-sm'>
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full inline-block"></span>
                    AVAILABLE
                </p>
                <p className='text-sm'>
                    <span className="w-2 h-2 mr-1 bg-orange-400 rounded-full inline-block"></span>
                    FAST FILLING
                </p>
            </div>

            <hr className='border text-gray-700' />

            <div className='m-5 ml-10'>
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
