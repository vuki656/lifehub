import * as actionTypes from '../actions/types'

const initialState = {
    username: '',
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                username: action.payload.username,
            }
        default:
            return state
    }
}

export default userReducer
