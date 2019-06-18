import moment from "moment";

// Check if itterating date is in selected week days
// Used to determin in which days to save todo
export const checkIfIsDayBeingSavedTo = (dateToCheck, selectedWeekDays) => {
    let dayOfWeek = moment(dateToCheck).format("dddd");

    if (selectedWeekDays.includes(dayOfWeek)) {
        return true;
    } else {
        return false;
    }
};

// Remove single node in firebase
export const deleteSingleNode = (
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
    currentDay
) => {
    // Convert selected week days array to string
    let repeatingDaysString = selectedWeekDays.toString();
    let determinedCreatedAtDate;

    // Determine if todo.createdAt exists
    // When creating, currentDay will be used as todo.created at doesent exist
    // When updating, exisiting createdAt will be used from todo
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
            repeatingOn: repeatingDaysString
        })
        .catch(err => {
            console.error(err);
        });
};
