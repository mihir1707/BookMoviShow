import React from 'react'
import ShowTImeBlock from './ShowTImeBlock.jsx'
import {MoviesShowData} from '../assets/ShowData.js'

function ShowCard({ theaters, id, selectedDateIndex, selectedDateLabel }) {

    const screens = MoviesShowData?.[0]?.screens || []

    const isFutureShowTime = (time) => {
        const now = new Date()
        const selectedDate = new Date(selectedDateLabel)
        if(selectedDate.toDateString() !== now.toDateString()){
            return true
        }
        const [timePart, modifier] = time.split(" ")
        let [hours, minutes] = timePart.split(":").map(Number)
        if(modifier === "PM" && hours !== 12) hours += 12
        if(modifier === "AM" && hours === 12) hours = 0
        const showTime = new Date(selectedDate)
        showTime.setHours(hours, minutes, 0, 0)
        return showTime>now
    }

    return (
        <div className=' flex-wrap gap-4 items-start mt-2 bg-black'>
            {
                theaters.map((theater, idx) => {

                    // <div>
                        const screen = screens[idx % screens.length]

                        if(!screen) return null

                        return (
                            <div
                                key={theater._id}
                                className='flex items-start mt-5 gap-15'
                            >

                                {/* Theatre name */}
                                <div className='ml-20 mt-5 text-white min-w-50 self-start'>
                                    {theater.name}
                                </div>

                                {/* Screen + Times */}
                                <div className='ml-20 flex flex-col gap-4 p-5'>
                                    {/* <p className="text-gray-400 mb-2">
                                        {screen.screenNo}
                                    </p> */}

                                    <div
                                        // onClick={
                                        //     () => navigate(`/movies/${id}/theater-list`)
                                        // } 
                                        className='flex flex-row flex-wrap gap-4'>
                                        {
                                            screen.times
                                                .filter(time => isFutureShowTime(time))
                                                .map((time, index) => (
                                                <ShowTImeBlock
                                                    key={`${screen._id}-${index}`}
                                                    time={time}
                                                    theatreId={theater._id}
                                                    screenNo={screen.screenNo}
                                                    theaterName={theater.name}
                                                    id={id}
                                                    selectedDateIndex={selectedDateIndex}
                                                    selectedDateLabel={selectedDateLabel}
                                                    seats={screen.seats}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    // </div>
            })
            }
        </div>
    )
}

export default ShowCard
