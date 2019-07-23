import * as actionTypes from "./types";

// Update tag arr with given arr
export const updateTagList = updatedReminderTaglist => {
    return {
        type: actionTypes.UPDATE_REMINDER_TAGS,
        payload: {
            updatedReminderTagList: updatedReminderTaglist
        }
    };
};

// Fetch tag list
export const fetchTags = ({ tagsRef, currentUser }) => async dispatch => {
    tagsRef.child(`${currentUser.uid}`).once("value", tagList => {
        let tagHolder = [];
        tagList.forEach(tag => {
            let key = tag.key;
            let text = tag.val().text;
            let color = tag.val().color;
            tagHolder.push({ key, text, color });
        });

        dispatch({
            type: actionTypes.FETCH_TAGS,
            payload: {
                tagList: tagHolder
            }
        });
    });
};

// Fetch tags in reminder
export const fetchReminderTags = ({
    currentDay,
    remindersRef,
    currentUser,
    reminder,
    tagsRef
}) => async dispatch => {
    // If reminder doesent exist, set all false tag list
    if (reminder) {
        remindersRef
            .child(`${currentUser.uid}/${currentDay}/${reminder.key}/tags/`)
            .once("value", tags => {
                let reminderTagHolder = {};
                tags.forEach(tag => {
                    reminderTagHolder[tag.key] = tag.val();
                });

                dispatch({
                    type: actionTypes.FETCH_REMINDER_TAGS,
                    payload: {
                        reminderTagList: reminderTagHolder
                    }
                });
            });
    } else {
        tagsRef.child(`${currentUser.uid}`).once("value", tagList => {
            let reminderTagHolder = {};
            tagList.forEach(tag => {
                reminderTagHolder[tag.key] = false;
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
