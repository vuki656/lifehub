import * as actionTypes from './types'

export const setUser = (user) => {
    return {
        type: actionTypes.SET_USER,
        payload: { user },
    }
}

export const setSelectedDate = (selectedDate) => {
    return {
        type: actionTypes.SET_SELECTED_DATE,
        payload: { selectedDate },
    }
}

export const logUserOut = () => {
    return { type: actionTypes.LOG_OUT_USER }
}
