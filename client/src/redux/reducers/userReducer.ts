import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import * as actionTypes from '../actions/types'

dayjs.extend(utc)

const initialState = {
    username: '',
    selectedDate: dayjs.utc().startOf('day').toDate(),
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                username: action.payload.username,
            }
        case actionTypes.SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload.selectedDate,
            }
        case actionTypes.LOG_OUT_USER:
            return {
                ...initialState,
            }
        default:
            return state
    }
}

export default userReducer
