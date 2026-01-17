import dayjs from 'dayjs'

export const getNext7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().add(i, 'day')
        return {
            day: date.format('ddd').toUpperCase(),
            date: date.format('DD'),              
            month: date.format('MMM').toUpperCase(),
            fullDate: date.format('YYYY-MM-DD')
        }
    })
}
