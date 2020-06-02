import * as actionTypes from './types'

export const setUser = (username) => {
    return {
        payload: { username },
        type: actionTypes.SET_USER,
    }
}

export const setSelectedDate = (selectedDate) => {
    return {
        payload: { selectedDate },
        type: actionTypes.SET_SELECTED_DATE,
    }
}

export const logUserOut = () => {
    return { type: actionTypes.LOG_OUT_USER }
}
