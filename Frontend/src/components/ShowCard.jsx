import React from 'react'
import ShowTImeBlock from './ShowTImeBlock'

function ShowCard({ times, id, selectedDateIndex, selectedDateLabel }) {
    return (
        <div className='flex items-start mt-2 bg-black'>
            <div className='ml-20 mt-5 text-white min-w-50 self-start'>
                Theater Name
            </div>
            <div className='ml-20 flex p-5 flex-row flex-wrap gap-4'>
                {
                    times.map((time, index)=>(
                        <ShowTImeBlock 
                            key={`${time}-${index}`}
                            time={time} 
                            id={id} 
                            selectedDateIndex={selectedDateIndex} 
                            selectedDateLabel={selectedDateLabel}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default ShowCard
