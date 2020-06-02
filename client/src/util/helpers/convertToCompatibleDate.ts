import dayjs from 'dayjs'

// Return date converted to backend compatible string
export const toCompatibleDate = (date: Date): string => {
    return dayjs(date).format('YYYY-MM-DD')
}
