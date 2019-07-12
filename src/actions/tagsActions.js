import * as actionTypes from "./types";

// Add given tag to tag arr
export const addTagToList = tag => {
    return {
        type: actionTypes.ADD_TAG,
        payload: {
            tagToAdd: tag
        }
    };
};

// Update tag arr with given arr
export const updateTagList = (updatedTaglist = []) => {
    return {
        type: actionTypes.UPDATE_TAG_LIST,
        payload: {
            updatedTagList: updatedTaglist
        }
    };
};

// Fetch active tags from given reminder
export const fetchReminderTags = ({
    currentDay,
    remindersRef,
    currentUser,
    reminder
}) => async dispatch => {
    // If reminder doesent exist, dont fetch its tags
    if (reminder) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags/`)
            .once("value", reminderTagList => {
                let reminderTagHolder = [];
                reminderTagList.forEach(tag => {
                    let key = tag.key;
                    let text = tag.val().text;
                    let color = tag.val().color;
                    reminderTagHolder.push({ key, text, color });
                });

                dispatch({
                    type: actionTypes.FETCH_REMINDER_TAGS,
                    payload: {
                        reminderTagList: reminderTagHolder
                    }
                });
            });
    }
};
