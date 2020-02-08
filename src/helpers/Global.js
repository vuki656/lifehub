import moment from "moment";

// Returns date formatted by given moment format
export const formatMoment = (objectToFormat, stringFormat) => {
    return moment(objectToFormat).format(stringFormat);
};

// Return day only timestamp from given date
export const getDayOnlyTimestamp = date => {
    return moment(moment(date).startOf("day")).valueOf();
};

// Return the given word with first letter upper case
export const getWordToTitleCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
