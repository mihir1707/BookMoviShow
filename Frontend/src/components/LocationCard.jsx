import { Crosshair, Search } from 'lucide-react'
import { cities } from '../lib/cities'
import CityCard from './CityCard'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import getDistanceKm from '../lib/getDistance.js'

function LocationCard({ onClose }) {

    const modalRef = useRef(null)

    const [city, setCity] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [allCities, setAllCities] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/cities")
            .then(res => setAllCities(res.data.data || []))
            .catch(() => setAllCities([]));
    }, []);


    useEffect( () => {
        if(city.trim().length<2){
            setResults([])
            setLoading(false)
            return
        }

        const timer = setTimeout( async() => {
            try{
                setLoading(true)
                const res = await axios.get(
                    "http://localhost:8000/api/v1/cities/search",
                    {params: {city}}
                );
                setResults(res.data.data || []);
            }
            catch(error){
                console.error("City search error:", error);
                setResults([]);
            }
            finally{
                setLoading(false)
            }
        },300)

        return () => clearTimeout(timer)

    },[city])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(modalRef.current && !modalRef.current.contains(e.target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [onClose])

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const {latitude, longitude} = coords

                let nearestCity = null
                let minDistance = Infinity

                allCities.forEach(ct=> {
                    if(!ct.lat || !ct.lng) return;

                    const dist = getDistanceKm(
                        latitude,
                        longitude,
                        parseFloat(ct.lat),
                        parseFloat(ct.lng),
                    )

                    if(dist<minDistance){
                        minDistance=dist
                        nearestCity=ct
                    }

                })

                if(!nearestCity){
                    alert("Unable to detect nearby city");
                    return;
                }

                selectCity(nearestCity.name)

            },
            () => alert("Location permission denied")
        )

    };

    const selectCity = (cityName) => {
        localStorage.setItem("userCity", cityName);
        window.dispatchEvent(
            new CustomEvent("city-changed", { detail: cityName })
        );
        setCity("")
        setResults([])
        onClose();
    };


    return (
        <div className="fixed inset-70 bg-black/60 flex items-center justify-center">

            <div
                ref={modalRef} 
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-200 rounded-lg pl-2 pr-2 relative'
            >

                <div className='flex items-center gap-3 px-4 py-3 rounded-md mt-2 border-2 border-black'>
                    <Search size={18} className="text-black"/>
                    <input
                        placeholder="Search for your city"
                        className="w-full outline-none text-black"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                {
                    results.length > 0 && (
                        <div className='border mt-2 rounded-md max-h-52 overflow-y-auto'>
                            {
                                results.map((c) => (
                                    <div 
                                        key={c._id}
                                        onClick={() => selectCity(c.name)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        <p 
                                            className="font-medium text-xs text-black"
                                        >
                                            {c.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {c.state} 
                                            {/* • {c.cinemaCount} cinemas */}
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                {loading && city && (
                    <p className="text-sm text-gray-500 mt-2 px-4">
                        Searching cities for <span className="font-semibold">`{city}`</span>...
                    </p>
                )}

                {!loading && city.length >= 2 && results.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2 px-4">
                        No cities found for "{city}"
                    </p>
                )}



                <button
                    onClick={detectLocation}
                    className="flex items-center gap-2 text-red-500 mt-4 text-md cursor-pointer"
                >
                    <Crosshair size={16}/>
                    Detect my location
                </button>

                <hr className="my-3 text-black w-full" />

                <p className='text-center text-black mb-5'>Popular Cities</p>

                <div className='grid grid-cols-10 gap-2'>
                    {cities.map((c) => (
                        <div key={c.name} className="flex flex-col items-center">
                            <CityCard
                                city={c}
                                onSelect={selectCity}
                            />
                            <p className="text-sm text-black">{c.name}</p>
                        </div>
                    ))}
                </div>

                <p className='text-center text-red-500 mt-4 mb-4 text-sm cursor-pointer'>
                    View All Cities
                </p>

            </div>
        </div>
    )
}

export default LocationCard
