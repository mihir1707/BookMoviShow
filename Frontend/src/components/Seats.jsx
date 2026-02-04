import React from 'react'

function Seats({
    seatCount,
    selectedSeats,
    setSelectedSeats,
    SeatsStructure,
    selectedSeatCount,
    seatType,
    startRowIndex,
}) {
    const seatsPerRow = SeatsStructure.reduce((a, b) => a + b, 0)
    const totalRows = Math.ceil(seatCount / seatsPerRow)

    const gapIndexes = SeatsStructure
        .slice(0, -1)
        .reduce((acc, val) => {
            acc.push((acc.at(-1) || 0) + val)
            return acc
        }, [])

    const handleSeatClick = (seatId, seatNoLabel) => {
        setSelectedSeats(prev => {
            const exists = prev.find(s => s.id === seatId)

            if (exists) {
                return prev.filter(s => s.id !== seatId)
            }

            if (prev.length >= selectedSeatCount) return prev

            return [...prev, { id: seatId, seatNo: seatNoLabel, type: seatType }]
        })
    }


    return (
        <div className="w-full">
            {Array.from({ length: totalRows }).map((_, rowIndex) => {
                const rowChar = String.fromCharCode(65 + rowIndex + startRowIndex)
                const seatsInRow = Math.min(
                    seatsPerRow,
                    seatCount - rowIndex * seatsPerRow
                )

                return (
                    <div
                        key={rowChar}
                        className="grid grid-cols-[80px_1fr_80px] items-center mb-4"
                    >
                        <div className="flex justify-center">
                            {rowChar}
                        </div>

                        <div className="flex justify-center">
                            <div className="flex items-center gap-2">
                                {Array.from({ length: seatsInRow }).map((_, i) => {
                                    const seatNo = i + 1
                                    const seatLabel = `${rowChar}${seatNo}`
                                    const seatId = `${rowChar}${seatNo}`
                                    const isSpace = gapIndexes.includes(i + 1)
                                    const isSelected = selectedSeats.some( s => s.id === seatId )

                                    return (
                                        <React.Fragment key={seatId}>
                                            <button
                                                onClick={() => handleSeatClick(seatId, seatLabel)}
                                                className={`w-8 h-8 text-xs rounded cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-700 text-white'
                                                }`}
                                            >
                                                {seatNo}
                                            </button>

                                            {isSpace && <div className="w-4" />}
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        </div>

                        <div />
                    </div>
                )
            })}

        </div>
    )
}

export default Seats
