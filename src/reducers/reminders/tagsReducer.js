import * as actionTypes from "../../actions/types";

const initialState = {
    reminderTagList: [],
    tagToAdd: {}
};

const tagsReducer = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default tagsReducer;
