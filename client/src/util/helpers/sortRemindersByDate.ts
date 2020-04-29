export const sortRemindersByDate = (arrayToSort) => {
    return arrayToSort.sort((a, b) => {
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    })
}
