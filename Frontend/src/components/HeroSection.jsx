import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function HeroSection() {

    const [currentImage, setCurrentImage] = useState(0)
    const [nowShowingMovies, setNowShowingMovies] = useState([])
    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchNowShowing = async () => {
            try {
                const res = await axios.get(`${baseUrl}/movies/now-showing`)
                setNowShowingMovies(res.data.data || []);
            }
            catch(error){
                console.log("Now Showing Movies fetch error", error);
                setNowShowingMovies([]);
            }
        }
        fetchNowShowing()
    },[])

    useEffect(()=>{
        if(!nowShowingMovies.length) return;

        const interval = setInterval(()=>{
            setCurrentImage(prev => (prev+1) % nowShowingMovies.length)
        },5000)
        return () => clearInterval(interval)
    },[nowShowingMovies])

    if(!nowShowingMovies.length){
        return <div className="h-[70vh] w-full bg-gray-900 animate-pulse"></div>
    }

    const currentMovie = nowShowingMovies[currentImage];

    return (
        <div className="relative w-full h-[75vh] md:h-[85vh] bg-black overflow-hidden group mb-10 mt-[80px]">
            {/* Background Image */}
            <div 
                className='absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-1000 ease-in-out scale-105 group-hover:scale-100'
                style={{ 
                    backgroundImage: `url(${currentMovie.bannerUrl || currentMovie.posterUrl})`, 
                }}
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent pointer-events-none"></div>
            
            {/* Movie Info */}
            <div className="absolute bottom-12 left-6 md:left-16 z-10 max-w-2xl text-white">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        {currentMovie.censorRating || "U/A"}
                    </span>
                    <span className="text-gray-300 text-sm font-medium">
                        {currentMovie.languages?.join(', ') || "Various"}
                    </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide drop-shadow-2xl mb-4 line-clamp-2 leading-tight">
                    {currentMovie.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base font-medium line-clamp-3 mb-8 drop-shadow-md">
                    {currentMovie.description}
                </p>
                <Link to={`/movies/${currentMovie._id}`} className="px-8 py-3 bg-primary hover:bg-primary-dull text-white font-bold rounded-full transition-transform hover:scale-105 inline-block shadow-lg">
                    Book Tickets
                </Link>
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 right-6 md:right-16 flex gap-2 z-10">
                {nowShowingMovies.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentImage ? 'w-8 bg-primary' : 'w-2 bg-gray-500/50'}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default HeroSection