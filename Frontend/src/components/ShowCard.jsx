import React from 'react'
import ShowTImeBlock from './ShowTImeBlock.jsx'
import { MapPin, Info } from 'lucide-react'

function ShowCard({ theaterShows, id, selectedDateLabel }) {

    const isFutureShowTime = (time) => {
        const now = new Date()
        
        // Parse "YYYY-MM-DD" safely to avoid timezone shifts
        const [year, month, day] = selectedDateLabel.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        if(selectedDate.toDateString() !== now.toDateString()){
            return selectedDate > now ? true : false;
        }

        const [timePart, modifier] = time.split(" ")
        let [hours, minutes] = timePart.split(":").map(Number)
        if(modifier === "PM" && hours !== 12) hours += 12
        if(modifier === "AM" && hours === 12) hours = 0

        const showTime = new Date(selectedDate)
        showTime.setHours(hours, minutes, 0, 0)
        return showTime > now
    }

    return (
        <div className='flex flex-col gap-4 sm:gap-6 items-start mt-2 bg-black'>
            {
                theaterShows.map((theater) => {

                    // The UI selectedDateLabel format is usually "2026-06-12", but our DB stores "12 Jun"
                    // Parse safely
                    const [year, m, d] = selectedDateLabel.split('-').map(Number);
                    const dateObj = new Date(year, m - 1, d);

                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
                    const formattedDate = `${day} ${monthStr}`; // e.g. "12 Jun"

                    const dateData = theater.showDates?.[formattedDate];
                    
                    if (!dateData || !dateData.screens) return null;
                    
                    let hasFutureTimes = false;
                    dateData.screens.forEach(screen => {
                        if (screen.times && screen.times.some(t => isFutureShowTime(t.time))) {
                            hasFutureTimes = true;
                        }
                    });

                    if (!hasFutureTimes) return null;

                    return (
                        <div
                            key={theater._id}
                            className='flex flex-col md:flex-row items-start md:items-stretch w-full bg-black border border-gray-800 hover:border-primary/50 transition-colors duration-300 rounded-xl overflow-hidden shadow-lg'
                        >
                            {/* Theatre Info Side */}
                            <div className='w-full md:w-1/3 bg-black p-4 sm:p-5 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-800'>
                                <h3 className='text-white font-bold text-base sm:text-lg mb-2'>
                                    {theater.name}
                                </h3>
                                <div className='flex items-start gap-1 text-gray-400 text-xs sm:text-sm mt-1'>
                                    <MapPin className='w-4 h-4 flex-shrink-0 mt-0.5 text-primary' />
                                    <span className='line-clamp-2'>{theater.address?.full || 'Location details available at venue'}</span>
                                </div>
                                <div className='flex items-center gap-1 text-gray-500 text-xs mt-3 cursor-pointer hover:text-gray-300 transition-colors w-fit'>
                                    <Info className='w-3.5 h-3.5' />
                                    <span>INFO</span>
                                </div>
                            </div>

                            {/* Showtimes Side */}
                            <div className='w-full md:w-2/3 p-4 sm:p-6 flex flex-col justify-center'>
                                <p className='text-xs text-gray-400 mb-3 ml-2 flex items-center gap-2'>
                                    <span className='w-1 h-1 bg-green-500 rounded-full'></span>
                                    Available Showtimes
                                </p>
                                <div className='flex flex-col gap-4'>
                                    {dateData.screens.map((screen) => {
                                        const validTimes = screen.times?.filter(t => isFutureShowTime(t.time)) || [];
                                        if (validTimes.length === 0) return null;

                                        return (
                                            <div key={screen.screenNo} className="flex flex-row flex-wrap gap-3 sm:gap-4 items-center border-l-2 border-gray-800 pl-3">
                                                <span className="text-gray-500 text-xs whitespace-nowrap min-w-[60px]">Screen {screen.screenNo}</span>
                                                {validTimes.map((t, index) => (
                                                    <ShowTImeBlock
                                                        key={`${t.showId}-${index}`}
                                                        time={t.time}
                                                        showId={t.showId}
                                                        theatreId={theater._id}
                                                        screenNo={screen.screenNo}
                                                        theaterName={theater.name}
                                                        id={id}
                                                        selectedDateLabel={selectedDateLabel}
                                                        seats={screen.seats}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ShowCard
