import { Crosshair, Search, X } from 'lucide-react'
import CityCard from './CityCard'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import useCityStore from '../store/useCityStore'
import { cities } from '../lib/cities'

function LocationCard({ onClose }) {

    const modalRef = useRef(null)

    const [city, setCity] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [allCities, setAllCities] = useState([]);

    const baseUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        axios.get(`${baseUrl}/cities`)
            .then(res => setAllCities(res.data.data || []))
            .catch(() => setAllCities([]));
    }, []);


    useEffect(() => {
        if (city.trim().length < 2) {
            setResults([])
            setLoading(false)
            return
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true)
                const res = await axios.get(
                    `${baseUrl}/cities/search`,
                    { params: { city } }
                );
                setResults(res.data.data || []);
            }
            catch (error) {
                console.error("City search error:", error);
                setResults([]);
            }
            finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)

    }, [city])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const { latitude, longitude } = coords;

                    const res = await axios.get(
                        "https://nominatim.openstreetmap.org/reverse",
                        {
                            params: {
                                lat: latitude,
                                lon: longitude,
                                format: "json",
                            },
                        }
                    );

                    const address = res.data.address || {};
                    const detectedCity =
                        address.city ||
                        address.town ||
                        address.village ||
                        address.state;

                    if (!detectedCity) {
                        alert("Unable to detect city");
                        return;
                    }

                    const matchedCity = allCities.find(
                        (c) =>
                            c.name.toLowerCase() === detectedCity.toLowerCase()
                    );

                    if (!matchedCity) {
                        alert(`City "${detectedCity}" is not yet available. Please select manually.`);
                        return;
                    }

                    selectCity(matchedCity);

                } catch (error) {
                    console.error("Location detection failed", error);
                    alert("Unable to detect location. Please select manually.");
                }
            },
            (err) => {
                if (err.code === 1) {
                    alert("Location permission denied. Please select your city manually.");
                } else {
                    alert("Unable to get location. Please select your city manually.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };


    const handlePopularCityClick = (cityName) => {
        const matchedCity = allCities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
        if (matchedCity) {
            selectCity(matchedCity);
        } else {
            selectCity({ name: cityName });
        }
    };

    const setCityStore = useCityStore(state => state.setCity);

    const selectCity = (cityObj) => {
        setCityStore(cityObj.name, cityObj._id);
        setCity("")
        setResults([])
        onClose();
    };


    return (
        // Full-screen dark overlay
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 px-3 sm:px-4">

            <div
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
                className='bg-stone-900 border border-gray-700 w-full max-w-4xl rounded-xl p-4 shadow-2xl'
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">Select Your City</p>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Search Box */}
                <div className='flex items-center gap-3 px-3 py-2 rounded-md border border-gray-600 bg-black focus-within:border-primary transition-colors'>
                    <Search size={16} className="text-gray-400 flex-shrink-0" />
                    <input
                        placeholder="Search for your city..."
                        className="w-full outline-none bg-transparent text-sm text-white placeholder-gray-500"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        autoFocus
                    />
                    {city && (
                        <button onClick={() => setCity("")} className="text-gray-400 hover:text-white flex-shrink-0">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Search Results */}
                {results.length > 0 && (
                    <div className='border border-gray-700 mt-2 rounded-md max-h-48 overflow-y-auto bg-black'>
                        {results.map((c) => (
                            <div
                                key={c._id}
                                onClick={() => selectCity(c)}
                                className="px-4 py-2.5 cursor-pointer hover:bg-gray-900 border-b border-gray-800 last:border-0"
                            >
                                <p className="font-medium text-sm text-white">{c.name}</p>
                                <p className="text-xs text-gray-500">{c.state}</p>
                            </div>
                        ))}
                    </div>
                )}

                {loading && city && (
                    <p className="text-sm text-gray-500 mt-2 px-1">
                        Searching for <span className="font-semibold text-gray-300">"{city}"</span>...
                    </p>
                )}

                {!loading && city.length >= 2 && results.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2 px-1">
                        No cities found for "{city}". Try another name.
                    </p>
                )}

                {/* Detect Location Button */}
                <button
                    onClick={detectLocation}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 mt-4 text-sm cursor-pointer transition-colors"
                >
                    <Crosshair size={15} />
                    Detect my location
                </button>

                <hr className="my-3 border-gray-700" />

                <p className='text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider'>Popular Cities</p>

                <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2'>
                    {cities.map((c) => (
                        <div key={c.name} className="flex flex-col items-center">
                            <CityCard
                                city={c}
                                onSelect={() => handlePopularCityClick(c.name)}
                            />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default LocationCard
