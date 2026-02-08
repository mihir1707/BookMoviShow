import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { getNext7Days } from '../lib/getDates'

function DateSelector({ selectedDate, setSelectedDate, setSelectedDateLabel }) {
    const [dates, setDates] = useState(getNext7Days())

    useEffect(() => {
        if (dates.length > 0) {
            setSelectedDate(0);
            setSelectedDateLabel(
                dayjs(dates[0].fullDate).format('ddd, DD MMM, YYYY')
            )
        }
    }, [])

    useEffect(() => {
        const now = dayjs()
        const nextMidnight = now.endOf('day').add(1, 'second')
        const timeout = nextMidnight.diff(now)

        const timer = setTimeout(() => {
            setDates(getNext7Days())
            setSelectedDate(0)
            setSelectedDateLabel(
                dayjs(dates[0].fullDate).format('ddd, DD MMM, YYYY')
            )
        }, timeout)

        return () => clearTimeout(timer)
    }, [setSelectedDate, setSelectedDateLabel])

    return (
        <div className="flex gap-3">
            {dates.map((item, index) => {
                const isDisabled = index >= dates.length - 5
                const isSelected = selectedDate === index

                return (
                    <div
                        key={item.fullDate}
                        onClick={() => {
                            if (!isDisabled) {
                                setSelectedDate(index)
                                setSelectedDateLabel(
                                    dayjs(item.fullDate).format('ddd, DD MMM, YYYY')
                                )
                            }
                        }}
                        className={`
                            w-15 h-18.75 rounded-lg flex flex-col items-center justify-center
                            ${isDisabled
                                ? 'cursor-not-allowed border-red-500 text-gray-400 hover:bg-red-5'
                                : 'cursor-pointer hover:bg-primary-dull text-black'}
                            ${isSelected && !isDisabled ? 'bg-primary text-black' : 'bg-white'}
                        `}
                    >
                        <span className="text-xs font-semibold">{item.day}</span>
                        <span className="text-2xl font-bold">{item.date}</span>
                        <span className="text-xs">{item.month}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default DateSelector
