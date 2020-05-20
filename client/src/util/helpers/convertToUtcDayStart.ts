import dayjs, { Dayjs } from 'dayjs'

// Take date and return utc start of that day in UTC
export const toUTC = (date: Date | Dayjs) => {
    return dayjs.utc(date).startOf('day').toDate()
}
