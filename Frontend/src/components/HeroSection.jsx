import React, { useEffect, useState } from 'react'
import axios from 'axios'

function HeroSection() {

    const [currentImage, setCurrentImage] = useState(0)

    const [nowShowingMovies, setNowShowingMovies] = useState([])

    useEffect(() => {
        axios.post("http://localhost:8000/api/pvr/now-showing")
            .then(res => setNowShowingMovies(res.data.movies || []))
            .catch((error) => {
                console.log("Now Showing Movies data fetch error", error)
                setNowShowingMovies([])
            })
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
            className='mt-20 mb-20 flex items-center justify-center gap-4 px-6 w-[180vh] h-screen bg-center bg-cover bg-no-repeat transition-all duration-1000'
            style={{ 
                backgroundImage: `url(${nowShowingMovies[currentImage].mih})`, 
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100vw"
            }}
        >
        </div>

    )
}

export default HeroSection
