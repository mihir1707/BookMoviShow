import React from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

function Movies() {

    const [nowShowingMovies, setNowShowingMovies] = useState([])
    const [upComingMovies, setUpComingMovies] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            try{
                const nowShowing = await axios.post("http://localhost:8000/api/pvr/now-showing")
                const upComing = await axios.post("http://localhost:8000/api/pvr/up-coming")

                setNowShowingMovies(nowShowing.data.movies || [])
                setUpComingMovies(upComing.data.movies || [])
            }
            catch(error){
                console.error("Movies data fetch error", error)
                setNowShowingMovies([])
                setUpComingMovies([])
            }
        }

        fetchMovies()

    },[])

    if(!nowShowingMovies.length && !upComingMovies.length){
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold text-center'>
                No Movies available
            </h1>
        </div>
    }

    return (
        <>
            <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44'>
                <h1 className='text-2xl my-4'>Now Showing</h1>
                <div className='flex flex-wrap max-sm:justify-center gap-8'>
                    {
                        nowShowingMovies.map((movie, index)=>(
                            <MovieCard movie={movie} key={`${movie.moviename}-${index}`} />
                        ))
                    }
                </div>
            </div>
            
            <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44'>
                <h1 className='text-2xl my-4'>Up Coming</h1>
                <div className='flex flex-wrap max-sm:justify-center gap-8'>
                    {
                        upComingMovies.map((movie, index)=>(
                            <MovieCard movie={movie} key={`${movie.moviename}-${index}`} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Movies
