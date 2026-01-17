import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MoviesDetailsData } from '../assets/MoviesData'
import DateSelector from '../components/DateSelector'
import ShowCard from '../components/ShowCard'
import { MoviesShowData } from '../assets/ShowData'
import axios from 'axios'

function TheaterList() {


    const {id} = useParams()

    const [selectedDate, setSelectedDate] = React.useState(0)
    const [selectedDateLabel, setSelectedDateLabel] = React.useState("")
    const showTimes = MoviesShowData[0].times[selectedDate] || []

    const [nowShowingMovies, setNowShowingMovies] = useState([])

    useEffect(() => {
        axios.post("http://localhost:8000/api/pvr/now-showing")
            .then(res => setNowShowingMovies(res.data.movies || []))
            .catch((error) => {
                console.log("Now Showing Movies data fetch error", error)
                setNowShowingMovies([])
            })
    },[])

    const movie = nowShowingMovies.find(
        (m) => String(m.id) === String(id)
    )

    if(!movie){
        return <div className="mt-30">Not Available Movie</div>
    }

    return (
        <div className='mt-30 mb-20'>
            <hr className='border text-gray-700'></hr>

            <div className='m-5 ml-15'>
                <p className='text-4xl mb-2'>{movie.name}</p>

                <span className='text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'>
                    {`Movie runtime: ${movie.runtime ? movie.runtime : "—"}`}
                </span>

                <span className='ml-5 text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'>
                    {movie.certificate}
                </span>

                {
                    movie.genres.map((g) => (
                        <span className='ml-5 text-white rounded-full border-gray-300 border pl-1 pr-1 pb-0.5'>
                            {g}
                        </span>
                    ))
                }

            </div>
            <hr className='border text-gray-700'></hr>

            <div className='m-5 ml-15'>
                <DateSelector
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    setSelectedDateLabel={setSelectedDateLabel}
                />
            </div>

            <hr className='border text-gray-700 shadow-sm shadow-gray-700'></hr>

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

            <hr className='border text-gray-700'></hr>

            <div className='m-5 ml-15'>
                <ShowCard
                    times={showTimes} 
                    id={String(id)}
                    selectedDateIndex={selectedDate}
                    selectedDateLabel={selectedDateLabel}
                />
            </div>

            <div></div>

        </div>
    )
}

export default TheaterList