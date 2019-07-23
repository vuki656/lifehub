// Object Imports
import * as actionTypes from "./types";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

export const setCurrentDay = currentDay => {
    let dayStamp = getDayOnlyTimestamp(currentDay);

    return {
        type: actionTypes.SET_CURRENT_DAY,
        payload: {
            currentDay: dayStamp
        }
    };
};
