import * as actionTypes from './types'

export const setUser = (username) => {
    return {
        type: actionTypes.SET_USER,
        payload: {
            username,
        },
    }
}
