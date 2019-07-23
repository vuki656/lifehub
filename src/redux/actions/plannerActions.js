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

// Fetch user specific data from firebase
export const fetchUserSettings = ({
    usersRef,
    currentUser
}) => async dispatch => {
    usersRef.child(`${currentUser.uid}`).once("value", settingsList => {
        let settingsHolder = {};

        settingsList.forEach(setting => {
            settingsHolder[setting.key] = setting.val();
        });

        dispatch({
            type: actionTypes.FETCH_USER_SETTINGS,
            payload: {
                settings: settingsHolder
            }
        });
    });
};
