import * as actionTypes from "../actions/types";

const initialState = {
    reminderTagList: []
};

const tagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_REMINDER_TAGS:
            return {
                ...state,
                reminderTagList: action.payload.reminderTagList
            };
        case actionTypes.ADD_TAG:
            return {
                ...state,
                reminderTagList: [
                    ...state.reminderTagList,
                    action.payload.tagToAdd
                ]
            };
        case actionTypes.REMOVE_TAG:
            let updatedReminderList = state.reminderTagList.filter(
                tagFromList => tagFromList !== action.payload.tagToRemove
            );

            return {
                ...state,
                reminderTagList: updatedReminderList
            };
        default:
            return state;
    }
};

export default tagsReducer;
