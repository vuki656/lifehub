import * as actionTypes from "./types";

export const addTagToList = tag => {
    return {
        type: actionTypes.ADD_TAG,
        payload: {
            tagToAdd: tag
        }
    };
};

export const updateTagList = updatedTaglist => {
    return {
        type: actionTypes.UPDATE_TAG_LIST,
        payload: {
            updatedTagList: updatedTaglist
        }
    };
};

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
