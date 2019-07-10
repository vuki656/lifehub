import * as actionTypes from "./types";

export const addTagToList = tag => {
    return {
        type: actionTypes.ADD_TAG,
        payload: {
            tagToAdd: tag
        }
    };
};

export const removeTagFromList = tag => {
    return {
        type: actionTypes.REMOVE_TAG,
        payload: {
            tagToRemove: tag
        }
    };
};

export const fetchReminderTags = ({
    currentDay,
    remindersRef,
    currentUser,
    reminder
}) => async dispatch => {
    let reminderTagHolder = [];

    remindersRef
        .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags/`)
        .once("value", reminderTags => {
            if (reminderTags) {
                reminderTags.forEach(tag => {
                    let key = tag.key;
                    let text = tag.val().text;
                    let color = tag.val().color;
                    reminderTagHolder.push({ key, text, color });
                });
            }
        })
        .then(
            // WHY IS DISPATCH HERE???
            dispatch({
                type: actionTypes.FETCH_REMINDER_TAGS,
                payload: {
                    reminderTagList: reminderTagHolder
                }
            })
        );
};
