import React, { useEffect, useMemo, useState } from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import { dummyDateTimeData } from '../assets/assets.js'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import { MoviesDetailsData } from '../assets/MoviesData.js'
import MovieCard from '../components/MovieCard.jsx'
import Loading from '../components/Loading.jsx'
import { kConverter } from '../lib/kConverter.js'
import WatchTrailer from '../components/WatchTrailer.jsx'
import axios from 'axios'

function MovieDetails() {

    const navigate = useNavigate()
    const {id} = useParams()
    const [show, setShow] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

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

    const AllMovies = useMemo(() => (
        [ ...nowShowingMovies, ...upComingMovies] 
    ),[nowShowingMovies, upComingMovies])

    useEffect(() => {
        if(!AllMovies.length) return

        const selectedMovie = AllMovies.find(
            movie => String(movie.id) === String(id)
        )

        if(selectedMovie){
            setShow({
                movie: selectedMovie,
                dateTime: dummyDateTimeData,
            })
        }
    }, [id, AllMovies])

    if(!show){
        return <Loading />
    }

    const {movie} = show

    return (
        <div className='md:px-8 lg:px-25 pt-30 md:pt-50 p-5'>
            <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-black/80 shadow-amber-100 shadow-sm'>
                <img 
                    src={movie.miv} 
                    alt={movie.name}
                    className='max-md:mx-auto rounded-xl p-1 w-48 md:w-56 lg:w-90 object-contain'
                />
                <div className='relative flex flex-col gap-3 justify-center'>
                    <h1 className='text-4xl font-semibold max-w-96 text-balance'>{movie.name}</h1>
                    
                    <div className='border-2 p-2 flex items-center gap-2 text-xl bg-gray-950'>
                        <StarIcon className='w-5 h-5 text-yellow-400 fill-yellow-400'/>
                        {
                            movie.rating?.imdb ? `${Number(movie.rating.imdb).toFixed(1)}/10 (${kConverter(movie.rating.votes)}+ Votes)` : "—"
                        }
                    </div>

                    <div className='flex flex-row'>
                        <span className=''>{ movie.runtime ? movie.runtime : "—" }</span>
                        <span className='ml-3 font-extrabold'>•</span>
                        <span className='ml-3'>{ movie.genres?.length ? movie.genres.map(g => g).join("/") : "—" }</span>
                        <span className='ml-3 font-extrabold'>•</span>
                        <span className='ml-3'>{ movie.releaseDate ? movie.releaseDate.split("-")[0] : "—" }</span>
                    </div>

                    <p className=''>{movie.languages?.join(", ")}</p>

                    <div className='flex items-center flex-wrap gap-4 mt-4'>
                        <button 
                            onClick={()=>setIsOpen(true)}
                            className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95'>
                            <PlayCircleIcon className='w-5 h-5'/>
                            Watch Trailer
                        </button>
                        { isOpen && <WatchTrailer onClose={() => setIsOpen(false)} url={movie.trailer} /> }

                        <a
                            onClick={()=>{
                                navigate(`/movies/${movie.id}/theater-list`)
                                window.scroll(0,0)
                            }}
                            className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'
                        >
                            Buy Tickets
                        </a>
                        <button className='bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95'>
                            <Heart className={`w-5 h-5`}/>
                        </button>
                    </div>
                </div>
            </div>

            
            <div className='text-xl font-medium mt-10'>
                <p>About the movie</p>
                <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl'>{movie.synopsis}</p>
            </div>

            <hr className='mt-10 border'></hr>


            {/* CAST */}
            <p className='text-3xl font-medium mt-10'>Cast</p>
            <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
                <div className='flex gap-5 w-max px-4'>
                    {
                        movie.casts?.map((cast, index)=>(
                            <div 
                                key={index} 
                                className='flex flex-col items-center text-center'
                            >
                            {/* <img 
                                src={cast.image} 
                                alt={cast.name}
                                className='w-25 h-25 md:w-25 md:h-25 rounded-full object-contain bg-gray-200'
                            /> */}
                            <p className='font-medium text-md mt-3 w-27.5 wrap-break-word'>{cast}</p>
                            {/* <p className='text-sm mt-3 w-27.5 wrap-break-word text-gray-400'>{cast.role.join(", ")}</p> */}
                            </div>
                        ))
                    }
                </div>
            </div>


            {/* Crew */}
            <p className='text-3xl font-medium mt-10'>Crew</p>
            {/* <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
                <div className='flex gap-5 w-max px-4'>
                    {
                        show.movie.Crew?.map((crew, index)=>(
                            <div 
                                key={index} 
                                className='flex flex-col items-center text-center'
                            >
                            <img 
                                src={crew.image} 
                                alt={crew.name}
                                className='w-25 h-25 md:w-25 md:h-25 rounded-full object-contain bg-gray-200'
                            />
                            <p className='font-medium text-md mt-3 w-27.5 wrap-break-word'>{crew.name}</p>
                            <p className='text-sm mt-3 w-27.5 wrap-break-word text-gray-400'>{crew.role.join(", ")}</p>
                            </div>
                        ))
                    }
                </div>
            </div> */}

            <hr className='mt-10 border'></hr>

            <p className='text-2xl mt-10'>You might also like</p>
            <div className='flex flex-wrap max-sm:justify-center gap-8 mb-10 mt-10'>
                {
                    nowShowingMovies.slice(0,4).map((mv, index)=>(
                        <MovieCard key={`${mv.id}-${index}`} movie={mv}/>
                    ))
                }
            </div>

            {/* <div className='flex justify-center mt-20'>
                <button 
                    onClick={
                        () => { 
                            navigate('/movies');
                            window.scrollTo(0,0)
                        }
                    } 
                    className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>Show more</button>
            </div> */}

        </div>
    )
}

export default MovieDetails
