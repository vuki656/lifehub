import dayjs from 'dayjs'

import * as actionTypes from '../../actions/types'

import { UserStateType } from './user.types'

const initialState: UserStateType = {
    selectedDate: dayjs().format('YYYY-MM-DD'), // Today
    user: {
        email: '',
        id: '',
        username: '',
    },
}

// TODO: prevent __typename from being put on state
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
