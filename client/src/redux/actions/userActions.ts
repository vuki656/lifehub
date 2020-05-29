import * as actionTypes from './types'

export const setUser = (username) => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            username,
        },
    }
}

export const setSelectedDate = (selectedDate) => {
    console.log(selectedDate)
    return {
        type: actionTypes.SET_SELECTED_DATE,
        payload: {
            selectedDate,
        },
    }
}

export const logUserOut = () => {
    return {
        type: actionTypes.LOG_OUT_USER,
    }
}
