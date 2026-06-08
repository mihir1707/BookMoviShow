import React from 'react'
import ReactPlayer from 'react-player';

function WatchTrailer({ onClose, url }) {
    return (
        <div onClick={onClose} className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center">
            <div 
                onClick={(e) => e.stopPropagation()} 
                className='bg-white w-200 rounded-lg pl-2 pr-2 relative'
            ></div>
            <div className='relative mt-6 w-full max-w-240 mx-auto border-2 border-white rounded shadow-primary shadow-md'>
                <ReactPlayer 
                    src={url} 
                    playing={true} 
                    controls={true} 
                    width='100%'
                    height='540px'
                />
            </div>
        </div>
    )
}

export default WatchTrailer
