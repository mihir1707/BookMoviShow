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
        <div className='flex flex-col gap-4 sm:gap-0 items-start mt-2 bg-black'>
            {
                theaters.map((theater, idx) => {

                    // <div>
                        const screen = screens[idx % screens.length]
                        const availableTimes = screen.times.filter(isFutureShowTime)

                        if(!screen) return null
                        if (availableTimes.length === 0) return null

                        return (
                            <div
                                key={theater._id}
                                className='flex flex-col sm:flex-row items-start mt-0 sm:mt-5 gap-3 sm:gap-15 w-full sm:w-auto'
                            >

                                {/* Theatre name */}
                                <div className='text-white min-w-40 sm:min-w-50 self-start text-xs sm:text-base px-2 sm:ml-20 sm:mt-5'>
                                    {theater.name}
                                </div>

                                <div className='ml-2 sm:ml-20 flex flex-col gap-2 sm:gap-4 p-2 sm:p-5 w-full'>

                                    <div
                                        className='flex flex-row flex-wrap gap-2 sm:gap-4'>
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
