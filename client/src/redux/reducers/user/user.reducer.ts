import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import * as actionTypes from '../../actions/types'

import { UserStateType } from './user.types'

dayjs.extend(utc)

const initialState: UserStateType = {
    selectedDate: dayjs().format('YYYY-MM-DD'), // Today
    user: {
        email: '',
        id: '',
        username: '',
    },
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload.user,
            }
        case actionTypes.SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload.selectedDate,
            }
        case actionTypes.LOG_OUT_USER:
            return { ...initialState }
        default:
            return state
    }
}

export default userReducer
