import moment from "moment";

// Check if itterating date is in selected week days
// Used to determin in which days to save todo
export const checkIfIsDayBeingSavedTo = (dateToCheck, selectedWeekDays) => {
    let dayOfWeek = moment(dateToCheck).format("dddd");

    if (selectedWeekDays.includes(dayOfWeek)) {
        return true;
    } else {
        return false;
    }
};
