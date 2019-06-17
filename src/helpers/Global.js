import moment from "moment";

// Returns date formated by given moment format
export const formatMoment = (objectToFormat, stringFormat) => {
    return moment(objectToFormat).format(stringFormat);
};

// Return day only timestamp from given date
export const getDayOnlyTimestamp = date => {
    return moment(moment(date).startOf("day")).valueOf();
};
