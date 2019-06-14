import moment from "moment";

// Returns date formated by given moment format
export const formatMoment = (objectToFormat, stringFormat) => {
    return moment(objectToFormat).format(stringFormat);
};
