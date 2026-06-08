import React, { useEffect, useState } from 'react'
import HeroSection from '../components/HeroSection'
import ReactPlayer from 'react-player';
import { PlayCircleIcon } from 'lucide-react';
import MovieCard from '../components/MovieCard.jsx'
import axios from 'axios'

function Releases() {

    const [nowShowingMovies, setNowShowingMovies] = useState([])
    const [currentTrailer, setCurrentTrailer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchNowShowing = async () => {
            try {
                const res = await axios.get(`${baseUrl}/movies/now-showing`)
                setNowShowingMovies(res.data.data || []);
            }
            catch (error) {
                console.log("Now Showing Movies fetch error", error);
                setNowShowingMovies([]);
            }
        }
        fetchNowShowing()
    }, [])

    return (
        <>
            <HeroSection />
            <hr></hr>
            {/* <FeatureSelection/> */}

            <div className='px-3 sm:px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

                <div className='relative flex items-center justify-between pt-10 sm:pt-20 pb-5 sm:pb-10'>
                    <p className='text-gray-300 font-medium text-2xl sm:text-3xl md:text-4xl'>Now Showing</p>
                </div>

                <div className='flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 md:gap-8 lg:gap-10 mt-6 sm:mt-8'>
                    {
                        nowShowingMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                    }
                </div>

            </div>

            {/* <TrailersSection/> */}

            <div className='px-3 sm:px-6 md:px-16 lg:px-24 xl:px-44 py-10 sm:py-20 overflow-hidden'>
                <p className='text-gray-300 font-medium max-w-240 mx-auto text-2xl sm:text-3xl md:text-4xl'>Trailers</p>

                {nowShowingMovies.length > 0 && (
                    <div className='relative mt-4 sm:mt-6 w-full max-w-240 mx-auto border-2 border-white rounded shadow-primary shadow-md'>
                        {
                            !isPlaying ? (
                                <div
                                    className='relative cursor-pointer rounded-lg overflow-hidden'
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <img
                                        src={nowShowingMovies[currentTrailer]?.bannerUrl}
                                        alt='trailer'
                                        className='w-full h-40 sm:h-80 md:h-100 lg:h-135 object-cover brightness-75'
                                    />
                                    <PlayCircleIcon
                                        strokeWidth={1.6}
                                        className='absolute top-1/2 left-1/2 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 transform -translate-x-1/2 -translate-y-1/2 text-white'
                                    />
                                </div>
                            ) : (
                                <ReactPlayer
                                    url={nowShowingMovies[currentTrailer]?.trailerUrl}
                                    playing={isPlaying}
                                    controls
                                    width='100%'
                                    height='auto'
                                    className='aspect-video'
                                />
                            )
                        }
                    </div>
                )}

                <div className='group grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8 mt-8 sm:mt-20 max-w-3xl mx-auto'>
                    {
                        nowShowingMovies.map((movie, index) => (
                            <div key={movie._id}
                                onClick={() => {
                                    setCurrentTrailer(index);
                                    setIsPlaying(false);
                                }}
                                className='border-2 border-white relative group cursor-pointer rounded-lg overflow-hidden h-40 sm:h-48 md:h-60 hover:-translate-y-1 duration-300 transition shadow-md shadow-white hover:shadow-primary hover:shadow-xl'>
                                <img src={movie.posterUrl} alt='trailer' className='border-4 sm:border-8 border-black rounded-lg w-full h-full object-contain brightness-75' />
                                <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-4 sm:w-8 h-4 sm:h-8 md:w-12 md:h-12 transform -translate-x-1/2 -translate-y-1/2' />
                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default Releases
