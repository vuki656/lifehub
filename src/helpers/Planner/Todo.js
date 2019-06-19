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
