import moment from "moment";

// Checks if itterating date contains repating week or month days
export const isDayBeingSavedTo = (
    dateToCheck,
    repeatingOnDays,
    formatToCheck
) => {
    let itteratingDate = moment(dateToCheck).format(formatToCheck);
    return repeatingOnDays.includes(itteratingDate);
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
        .child(
            `${currentUser.uid}/${dayToRemove}/categories/${category}/${
                todo.key
            }`
        )
        .remove()
        .catch(error => console.error(error));
};
