import * as actionTypes from "../actions/types";

const initialState = {
    tagList: [],
    reminderTags: {},
    tagColor: "#2185d0"
};

const tagsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_TAG_COLOR:
            return {
                ...state,
                tagColor: action.payload.tagColor
            };
        case actionTypes.FETCH_TAGS:
            return {
                ...state,
                tagList: action.payload.tagList
            };
        case actionTypes.FETCH_REMINDER_TAGS:
            return {
                ...state,
                reminderTags: action.payload.reminderTagList
            };
        case actionTypes.UPDATE_REMINDER_TAGS:
            return {
                ...state,
                reminderTags: action.payload.updatedReminderTagList
            };
        default:
            return state;
    }
};

export default tagsReducer;
