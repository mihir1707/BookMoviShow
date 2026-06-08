import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DateSelector from '../components/DateSelector'
import ShowCard from '../components/ShowCard'
import { Skeleton } from '../components/Skeleton'
import axios from 'axios'
import useCityStore from '../store/useCityStore'

function TheaterList() {

    const { id } = useParams() // this is movieId

    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedDateLabel, setSelectedDateLabel] = useState(() => {
        const today = new Date()
        const yyyy = today.getFullYear()
        const mm = String(today.getMonth() + 1).padStart(2, "0")
        const dd = String(today.getDate()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`
    })

    const [movie, setMovie] = useState(null)
    const [location, setLocation] = useState(null)
    const [theaterShows, setTheaterShows] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const cityId = useCityStore(state => state.cityId);

    // Get Movie Details
    useEffect(() => {
        axios.get(`${baseUrl}/movies/${id}`)
            .then(res => setMovie(res.data.data))
            .catch((error) => console.log("Movie data fetch error", error))
    }, [id, baseUrl])

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
            },
            (err) => {
                setLocation({ lat: 23.0269, lng: 72.5872 }) // fallback
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        )
    }, [])

    useEffect(() => {
        const fetchShows = async () => {
            setIsLoading(true);
            try {
                const params = { movieId: id };
                if (cityId && cityId !== "undefined") {
                    params.cityId = cityId;
                } else if (location) {
                    params.lat = location.lat;
                    params.lng = location.lng;
                } else {
                    return; // Wait for location
                }

                const res = await axios.get(`${baseUrl}/shows`, { params });
                setTheaterShows(res.data.data || []);
            } catch (err) {
                console.error("Shows fetch error", err);
                setTheaterShows([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShows();
    }, [location, cityId, id, baseUrl]);

    if (!movie) return null;

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

                    {movie.genres?.map((g) => (
                        <span key={g} className='text-white text-xs sm:text-sm rounded-full border-gray-300 border pl-2 pr-2 pb-0.5'>
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
                <p className='text-xs sm:text-sm'><span className="w-2 h-2 mr-1 bg-green-500 rounded-full inline-block"></span>AVAILABLE</p>
                <p className='text-xs sm:text-sm'><span className="w-2 h-2 mr-1 bg-orange-400 rounded-full inline-block"></span>FAST FILLING</p>
            </div>

            <hr className='border text-gray-700' />

            <div className='m-3 sm:m-5 ml-3 sm:ml-10'>
                <div className='mb-3'>
                    {isLoading ? (
                        <div className="flex flex-col gap-4 mt-5">
                            <Skeleton className="w-full h-24" />
                            <Skeleton className="w-full h-24" />
                            <Skeleton className="w-full h-24" />
                        </div>
                    ) : theaterShows.length === 0 ? (
                        <p className='text-lg sm:text-xl font-medium'>No shows available for this date/location</p>
                    ) : (
                        <ShowCard
                            theaterShows={theaterShows}
                            id={String(id)}
                            selectedDateLabel={selectedDateLabel}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default TheaterList
