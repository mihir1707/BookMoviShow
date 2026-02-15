import { StampIcon, StarIcon } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom'

function MovieCard({ movie }) {

    const navigate = useNavigate()

    const isUpComingMoive = movie.isActive == false

    return (
        <div className='border-amber-100 border-2 p-2 flex flex-col justify-between rounded-2xl hover:shadow-white hover:shadow-xl hover:-translate-y-1 transition duration-300 shadow-md shadow-primary w-full max-w-32 sm:max-w-40 md:max-w-45 lg:max-w-50 xl:max-w-55'>

            <img
                onClick={() => {
                    navigate(`/movies/${movie._id}`); 
                    window.scrollTo(0, 0) 
                }}
                src={movie.posterUrl}
                alt={movie.title}
                className='w-full aspect-2/3 rounded-lg object-contain mb-2 cursor-pointer'
            />

            <hr></hr>
            <hr></hr>

            {/* <p className='flex items-center gap-1 text-sm text-white mt-1 pr-1'>
                <StarIcon className='w-4 h-4 text-yellow-400 fill-yellow-400' />
                {
                    movie.rating?.imdb ? Number(movie.rating.imdb).toFixed(1) : '—'
                }
            </p> */}

            <h1 className='text-xs sm:text-sm md:text-base lg:text-lg mt-2 truncate font-bold'>{movie.title}</h1>

            <p className='text-xs sm:text-sm text-white mt-1 md:mt-2 line-clamp-2'>
                {
                    movie.genres?.length ? movie.genres.join(" / ") : '—'
                }
            </p>
            <p className='text-xs sm:text-sm mt-1 md:mt-2'>
                {
                    movie.runtime?.length ? movie.runtime : '—'
                }
            </p>
            {
                isUpComingMoive && (
                    <p className='text-xs sm:text-sm mt-1 md:mt-2 line-clamp-1'>
                        {
                            movie.releaseDate ? new Date(movie.releaseDate).toDateString() : '—'
                        }
                    </p>
                )
            }
        </div>
    )
}

export default MovieCard
