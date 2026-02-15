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
                const nowShowing = await axios.get("http://localhost:8000/api/v1/movies/now-showing")
                const upComing = await axios.get("http://localhost:8000/api/v1/movies/upcoming")

                setNowShowingMovies(nowShowing.data.data || [])
                setUpComingMovies(upComing.data.data || [])
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
            <div className='relative my-20 sm:my-40 mb-40 sm:mb-60 px-3 sm:px-6 md:px-16 lg:px-40 xl:px-44'>
                <h1 className='text-xl sm:text-2xl my-2 sm:my-4'>Now Showing</h1>
                <div className='flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 md:gap-8'>
                    {
                        nowShowingMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                }
                </div>
            </div>
            
            <div className='relative my-20 sm:my-40 mb-40 sm:mb-60 px-3 sm:px-6 md:px-16 lg:px-40 xl:px-44'>
                <h1 className='text-xl sm:text-2xl my-2 sm:my-4'>Up Coming</h1>
                <div className='flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 md:gap-8'>
                    {
                        upComingMovies.map((movie)=>(
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Movies
