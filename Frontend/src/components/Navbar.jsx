import React, { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, MenuIcon, SearchIcon, XIcon } from 'lucide-react'
import LocationCard from './LocationCard';
import ProfileCard from './ProfileCard';
import { useAuth } from '../context/AuthContext.jsx';
import { assets } from '../assets/assets.js';
import useCityStore from '../store/useCityStore';

function Navbar() {

    const navigate = useNavigate();

    const { user, loading } = useAuth();

    const city = useCityStore(state => state.city);
    const setCityStore = useCityStore(state => state.setCity);

    const [openCity, setOpenCity] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [showNavbar, setShowNavbar] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const storedCity = localStorage.getItem("userCity");
        if (storedCity && !city) {
            setCityStore(storedCity, localStorage.getItem("userCityId"));
        }
    }, [city, setCityStore]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [user]);

    return (
        <div
            className={`bg-black/95 backdrop-blur-md border-b border-gray-800 fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-16 py-5`}
        >

            <Link to="/" className="flex items-center">
                <img
                    src={assets.logo}
                    alt="logo"
                    className="h-15 w-auto object-contain"
                />
            </Link>

            <div className={`${mobileMenuOpen ? 'max-md:w-full' : 'max-md:w-0'} max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:border border-b-primary-dull border-t-primary overflow-hidden transition-[width] duration-300`}>
                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setMobileMenuOpen(false)} />
                <Link onClick={() => scrollTo(0, 0)} to='/' className='hover:text-primary'>Home</Link>
                <Link onClick={() => scrollTo(0, 0)} to='/movies' className='hover:text-primary'>Movies</Link>
                <Link onClick={() => scrollTo(0, 0)} to='/releases' className='hover:text-primary'>Releases</Link>
                <Link onClick={() => scrollTo(0, 0)} to='/favorite' className='hover:text-primary'>Favorites</Link>
            </div>

            <div className="flex items-center gap-8">
                {/* <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" /> */}

                {!loading && (
                    user ? (
                        <ProfileCard user={user} />
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 sm:px-7 py-1 sm:py-2 bg-primary
                            hover:bg-primary-dull text-black transition rounded-full font-medium cursor-pointer"
                        >
                            Login
                        </button>
                    )
                )}
            </div>

            <button
                className='flex flex-row cursor-pointer'
                onClick={() => setOpenCity(true)}
            >
                {(city || "Select City").toUpperCase()}
                <ChevronDown className='w-4 h-4 mt-1.5 ml-1' />
            </button>

            {openCity && <LocationCard onClose={() => setOpenCity(false)} />}

            <MenuIcon
                className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
                onClick={() => setMobileMenuOpen(true)}
            />
        </div>
    )
}

export default Navbar