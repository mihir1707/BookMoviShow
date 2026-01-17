import React, { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MoviesDetailsData } from '../assets/MoviesData.js'
import MovieCard from './MovieCard.jsx'
import axios from 'axios'

function FeatureSelection() {

    const navigate = useNavigate()

    const [nowShowingMovies, setNowShowingMovies] = useState([])

    useEffect(() => {
        axios.post("http://localhost:8000/api/pvr/now-showing")
            .then(res => setNowShowingMovies(res.data.movies || []))
            .catch((error) => {
                console.log("Now Showing Movies data fetch error", error)
                setNowShowingMovies([])
            })
    },[])


    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

            <div className='relative flex items-center justify-between pt-20 pb-10'>
                <p className='text-gray-300 font-medium text-4xl'>Now Showing</p>
                <button onClick={()=>navigate('/movies')} className='cursor-pointer group flex items-center gap-2 text-sm text-gray-300'>
                    View All
                    <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
                </button>
            </div>

            <div className='flex flex-wrap max-sm:justify-center gap-10 mt-8'>
                {
                    nowShowingMovies.slice(0,4).map((movie, index)=>(
                        <MovieCard key={`${movie.moviename}-${index}`} movie={movie} />
                    ))
                }
            </div>

            <div className='flex justify-center mt-20'>
                <button onClick={()=>{navigate('movies');scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>
                    Show more
                </button>
            </div>

        </div>
    )
}

export default FeatureSelection
