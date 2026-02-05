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

    useEffect(() => {
        const fetchNowShowing = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/movies/now-showing")
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

            <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

                <div className='relative flex items-center justify-between pt-20 pb-10'>
                    <p className='text-gray-300 font-medium text-4xl'>Now Showing</p>
                </div>

                <div className='flex flex-wrap max-sm:justify-center gap-10 mt-8'>
                    {
                        nowShowingMovies.map((movie) => (
                            <MovieCard key={movie._id} movie={movie} />
                        ))
                    }
                </div>

            </div>

            {/* <TrailersSection/> */}

            <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
                <p className='text-gray-300 font-medium max-w-240 mx-auto text-4xl'>Trailers</p>

                {nowShowingMovies.length > 0 && (
                    <div className='relative mt-6 w-full max-w-240 mx-auto border-2 border-white rounded shadow-primary shadow-md'>
                        {
                            !isPlaying ? (
                                <div
                                    className='relative cursor-pointer rounded-lg overflow-hidden'
                                    onClick={() => setIsPlaying(true)}
                                >
                                    <img
                                        src={nowShowingMovies[currentTrailer]?.bannerUrl}
                                        alt='trailer'
                                        className='w-full h-135 object-cover brightness-75'
                                    />
                                    <PlayCircleIcon
                                        strokeWidth={1.6}
                                        className='absolute top-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 transform -translate-x-1/2 -translate-y-1/2 text-white'
                                    />
                                </div>
                            ) : (
                                <ReactPlayer
                                    url={nowShowingMovies[currentTrailer]?.trailerUrl}
                                    playing={isPlaying}
                                    controls
                                    width='100%'
                                    height='540px'
                                />
                            )
                        }
                    </div>
                )}

                <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-20 max-w-3xl mx-auto'>
                    {
                        nowShowingMovies.map((movie, index) => (
                            <div key={movie._id}
                                onClick={() => {
                                    setCurrentTrailer(index);
                                    setIsPlaying(false);
                                }}
                                className='border-2 border-white relative group cursor-pointer rounded-lg overflow-hidden max-md:h-60 md:max-h-60 hover:-translate-y-1 duration-300 transition shadow-md shadow-white hover:shadow-primary hover:shadow-xl'>
                                <img src={movie.posterUrl} alt='trailer' className='border-8 border-black rounded-lg w-full h-full object-contain brightness-75' />
                                <PlayCircleIcon strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2' />
                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default Releases
