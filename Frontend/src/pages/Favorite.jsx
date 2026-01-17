import React from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { MoviesDetailsData } from '../assets/MoviesData.js'

function Favorite() {
    return MoviesDetailsData.length > 0 ? (
        <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {
                    MoviesDetailsData.map((movie)=>(
                        <MovieCard movie={movie} key={movie.id} />
                    ))
                }
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold text-center'>No Movies available</h1>
        </div>
    )
}

export default Favorite
