import React, { useEffect, useState } from 'react'
import axios from 'axios'

function HeroSection() {

    const [currentImage, setCurrentImage] = useState(0)

    const [nowShowingMovies, setNowShowingMovies] = useState([])

    useEffect(() => {
        const fetchNowShowing = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/movies/now-showing")
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
        return <div className="mt-20 h-[70vh] bg-black"></div>
    }

    return (
        <div 
            className='mt-20 bg-black mb-20 flex items-center justify-center gap-4 px-6 w-[180vh] h-screen bg-center bg-cover bg-no-repeat transition-all duration-1000'
            style={{ 
                backgroundImage: `url(${nowShowingMovies[currentImage].bannerUrl})`, 
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100vw"
            }}
        >
        </div>

    )
}

export default HeroSection
