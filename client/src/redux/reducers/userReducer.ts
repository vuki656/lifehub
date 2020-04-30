import moment from 'moment'

import * as actionTypes from '../actions/types'

const initialState = {
    username: '',
    selectedDate: moment.utc().format(),
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
        default:
            return state
    }
}

export default userReducer
