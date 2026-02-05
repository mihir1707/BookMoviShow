import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import axios from 'axios'

function Favorite() {

    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8000/api/v1/users/favorites",
                    {
                        withCredentials: true 
                    }
                )

                setFavorites(res.data.data || [])
            } catch (error) {
                console.error("Favorite movies fetch error", error)
                setFavorites([])
            } finally {
                setLoading(false)
            }
        }

        fetchFavorites()
    }, [])

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <p className='text-gray-400 text-lg'>Loading favorites...</p>
            </div>
        )
    }

    return favorites.length > 0 ? (
        <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>

            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {
                    favorites.map((movie) => (
                        <MovieCard
                            key={movie._id}
                            movie={movie}
                        />
                    ))
                }
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-3xl font-bold text-center'>
                No Movies available
            </h1>
        </div>
    )
}

export default Favorite
