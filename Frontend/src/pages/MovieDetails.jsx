import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import MovieCard from '../components/MovieCard.jsx'
import Loading from '../components/Loading.jsx'
import WatchTrailer from '../components/WatchTrailer.jsx'
import axios from 'axios'

function MovieDetails() {

    const navigate = useNavigate()
    const { id } = useParams()

    const [movie, setMovie] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios.get(`${baseUrl}/movies/${id}`);
                setMovie(res.data.data);
                setIsFavorite(res.data.data.isFavorite);
            }
            catch (err) {
                console.error("Movie fetch error", err);
            }
        };

        fetchMovie();
    }, [id]);

    useEffect(() => {
        const fetchNowShowing = async () => {
            try {
                const res = await axios.get(`${baseUrl}/movies/now-showing`);
                setNowShowingMovies(res.data.data || []);
            }
            catch (err) {
                console.error("Movie fetch error", err);
                setNowShowingMovies([]);
            }
        };

        fetchNowShowing();
    }, []);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axios.get(
                    `${baseUrl}/movies/${id}`
                );
                setMovie(res.data.data);
            } catch (err) {
                console.error("Movie fetch error", err);
            }
        };

        fetchMovie();
    }, [id]);


    useEffect(() => {
        const checkFavorite = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token){
                    navigate('/login');
                }

                const res = await axios.get(
                    `${baseUrl}/users/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const isFav = res.data.data?.some(
                    (favMovie) => favMovie._id === id
                );

                setIsFavorite(isFav);
            } catch (err) {
                console.error("Favorite check error", err);
            }
        };

        checkFavorite();
    }, [id]);


    if (!movie) {
        return <Loading />
    }

    const toggleFavorite = async () => {
        try {

            const token = localStorage.getItem("accessToken");

            console.log(token)

            const res = await axios.post(`${baseUrl}/users/favorites/${movie._id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setIsFavorite(Boolean(res.data.data?.isFavorite));

            window.dispatchEvent(new Event("favorites-updated"));
        }
        catch (err) {
            console.error("Favorite error", err);
        }
    };



    return (
        <div className='md:px-8 lg:px-25 pt-20 sm:pt-30 md:pt-50 p-3 sm:p-5'>
            <div className='flex flex-col md:flex-row gap-4 sm:gap-8 max-w-6xl mx-auto bg-black/80 shadow-amber-100 shadow-sm'>
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className='max-md:mx-auto rounded-xl p-1 w-40 sm:w-48 md:w-56 lg:w-90 object-contain'
                />
                <div className='relative flex flex-col gap-2 sm:gap-3 justify-center px-2 sm:px-0'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold max-w-96 text-balance'>{movie.title}</h1>

                    <div className='flex flex-row flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm'>
                        <span className=''>{movie.runtime ? movie.runtime : "—"}</span>
                        <span className='font-extrabold'>•</span>
                        <span className='truncate'>{movie.genres?.length ? movie.genres.map(g => g).join("/") : "—"}</span>
                        <span className='font-extrabold'>•</span>
                        <span className='truncate'>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : "—"}</span>
                    </div>

                    <p className='text-xs sm:text-sm'>{movie.languages?.join(", ")}</p>

                    <div className='flex items-center flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4'>
                        <button
                            onClick={() => setIsOpen(true)}
                            className='flex items-center gap-2 px-4 sm:px-7 py-2 sm:py-3 text-black text-xs sm:text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'>
                            <PlayCircleIcon className='w-4 sm:w-5 h-4 sm:h-5' />
                            Watch Trailer
                        </button>
                        {isOpen && <WatchTrailer onClose={() => setIsOpen(false)} url={movie.trailerUrl} />}

                        {
                            movie.isActive ? (
                                <a
                                    onClick={() => {
                                        navigate(`/movies/${movie._id}/theater-list`)
                                        window.scroll(0, 0)
                                    }}
                                    className='px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm bg-primary text-black hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95'
                                >
                                    Buy Tickets
                                </a>
                            ) :
                                (
                                    <span className='font-bold text-primary text-xs sm:text-sm'>Movie release on <br />{movie.releaseDate ? new Date(movie.releaseDate).toDateString() : '—'}</span>
                                )
                        }
                        <button
                            onClick={toggleFavorite}
                            className='bg-primary p-2 sm:p-2.5 rounded-full transition cursor-pointer active:scale-95'
                        >
                            <Heart
                                className={`w-4 sm:w-5 h-4 sm:h-5 ${isFavorite ? "text-white fill-red-600" : "text-white fill-white"}`}
                            />
                        </button>
                    </div>
                </div>
            </div>


            <div className='text-lg sm:text-xl font-medium mt-6 sm:mt-10'>
                <p>About the movie</p>
                <p className='text-gray-400 mt-2 text-xs sm:text-sm leading-tight max-w-xl'>{movie.description}</p>
            </div>

            <hr className='mt-6 sm:mt-10 border'></hr>


            {/* CAST */}
            <p className='text-2xl sm:text-3xl font-medium mt-6 sm:mt-10'>Cast</p>
            <div className='overflow-x-auto no-scrollbar mt-4 sm:mt-8 pb-4'>
                <div className='flex gap-3 sm:gap-5 w-max px-2 sm:px-4'>
                    {
                        movie.cast?.map((cast, index) => (
                            <div
                                key={index}
                                className='flex flex-col items-center text-center'
                            >
                                {/* <img 
                                src={cast.image} 
                                alt={cast.name}
                                className='w-25 h-25 md:w-25 md:h-25 rounded-full object-contain bg-gray-200'
                            /> */}
                                <p className='font-medium text-xs sm:text-sm md:text-base mt-2 sm:mt-3 w-24 sm:w-27.5 wrap-break-word'>{cast}</p>
                                {/* <p className='text-sm mt-3 w-27.5 wrap-break-word text-gray-400'>{cast.role.join(", ")}</p> */}
                            </div>
                        ))
                    }
                </div>
            </div>


            {/* Crew */}
            {/* <p className='text-3xl font-medium mt-10'>Crew</p> */}
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

            <hr className='mt-6 sm:mt-10 border'></hr>

            <p className='text-xl sm:text-2xl mt-6 sm:mt-10'>You might also like</p>
            <div className='flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-5 md:gap-8 mb-8 sm:mb-10 mt-6 sm:mt-10'>
                {
                    nowShowingMovies.slice(0, 4).map((mv) => (
                        <MovieCard key={mv._id} movie={mv} />
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
