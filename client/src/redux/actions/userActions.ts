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
    return {
        type: actionTypes.SET_SELECTED_DATE,
        payload: {
            selectedDate,
        },
    }
}
