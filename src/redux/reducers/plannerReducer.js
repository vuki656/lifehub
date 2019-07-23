// Object Imports
import moment from "moment";
import * as actionTypes from "../actions/types";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

const initialState = {
    currentDay: getDayOnlyTimestamp(moment()),
    generateUntillDate: "",
    regDate: ""
};

const plannerReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_DAY:
            return {
                ...state,
                currentDay: action.payload.currentDay
            };
        case actionTypes.FETCH_USER_SETTINGS:
            return {
                ...state,
                generateUntillDate: action.payload.settings.generateUntill,
                regDate: action.payload.settings.regDate
            };
        default:
            return state;
    }
};

export default plannerReducer;
