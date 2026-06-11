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
        <div className='flex flex-col gap-6 sm:gap-8 items-start mt-6 bg-black w-full'>
            {
                theaterShows.map((theater) => {

                    const [year, m, d] = selectedDateLabel.split('-').map(Number);
                    const dateObj = new Date(year, m - 1, d);

                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' });
                    const formattedDate = `${day} ${monthStr}`;

                    const dateData = theater.showDates?.[formattedDate];
                    
                    if (!dateData || !dateData.screens) return null;
                    
                    let allValidTimes = [];
                    dateData.screens.forEach(screen => {
                        const validTimes = screen.times?.filter(t => isFutureShowTime(t.time)) || [];
                        validTimes.forEach(t => {
                            allValidTimes.push({ ...t, seats: screen.seats, screenNo: screen.screenNo });
                        });
                    });

                    if (allValidTimes.length === 0) return null;

                    return (
                        <div
                            key={theater._id}
                            className='flex flex-col md:flex-row items-start md:items-center w-full bg-black py-4 border-b border-gray-900/50'
                        >
                            {/* Theatre Name Side */}
                            <div className='w-full md:w-1/4 mb-4 md:mb-0 pr-4'>
                                <h3 className='text-white font-medium text-sm sm:text-base tracking-wide'>
                                    {theater.name}
                                </h3>
                            </div>

                            {/* Showtimes Grid */}
                            <div className='w-full md:w-3/4 flex flex-wrap gap-3 sm:gap-4'>
                                {allValidTimes.map((t, index) => (
                                    <ShowTImeBlock
                                        key={`${t.showId}-${index}`}
                                        time={t.time}
                                        showId={t.showId}
                                        theatreId={theater._id}
                                        screenNo={t.screenNo}
                                        theaterName={theater.name}
                                        id={id}
                                        selectedDateLabel={selectedDateLabel}
                                        seats={t.seats}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ShowCard
