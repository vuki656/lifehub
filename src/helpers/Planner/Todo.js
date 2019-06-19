import moment from "moment";
import { getDayOnlyTimestamp } from "../Global";

// Checks if itterating date contains repating week or month days
export const isDayBeingSavedTo = (
    dateToCheck,
    repeatingOnDays,
    formatToCheck
) => {
    let itteratingDate = moment(dateToCheck).format(formatToCheck);

    if (repeatingOnDays.includes(itteratingDate)) {
        return true;
    } else {
        return false;
    }
};

// Remove single node in firebase
export const deleteTodoFromFirebase = (
    dbRef,
    currentUser,
    dayToRemove,
    category,
    todo
) => {
    dbRef
        .child(`${currentUser.uid}/${dayToRemove}/${category}/${todo.key}`)
        .remove()
        .catch(error => console.error(error));
};

export const saveTodoInFirebase = (
    todoRef,
    currentUser,
    category,
    todo,
    selectedWeekDays,
    dayTimestamp,
    currentDay,
    selectedMonthDays
) => {
    let determinedCreatedAtDate;

    /*  Convert selected days array to string if exists
        Else use empty string
    */
    let repeatingDaysOfWeekString = selectedWeekDays
        ? selectedWeekDays.toString()
        : "";
    let repeatingDaysOMonthString = selectedMonthDays
        ? selectedMonthDays.toString()
        : "";

    /*  Determine if todo.createdAt exists
        When creating, currentDay will be used as todo.created at doesent exist
        When updating, exisiting createdAt will be used from todo
    */
    if (todo.createdAt) {
        determinedCreatedAtDate = todo.createdAt;
    } else {
        determinedCreatedAtDate = currentDay;
    }

    todoRef
        .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
        .update({
            createdAt: determinedCreatedAtDate,
            isChecked: false,
            key: todo.key,
            value: todo.value,
            isRepeating: true,
            repeatingOnWeekDays: repeatingDaysOfWeekString,
            repeatingOnMonthDays: repeatingDaysOMonthString
        })
        .catch(err => {
            console.error(err);
        });
};

// Change todo text in firebase in given date
export const chnageTodoTextInFirebase = (
    { todo, todoRef, category, currentUser, newTodo },
    date
) => {
    let dayTimestamp = getDayOnlyTimestamp(date);
    todoRef
        .child(`${currentUser.uid}/${dayTimestamp}/${category}/${todo.key}`)
        .update({ value: newTodo })
        .catch(err => {
            console.error(err);
        });
};
