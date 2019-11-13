const moment = require("moment");

// Get day before timestamp
module.exports.getYesterdayStamp = () => {
    return moment(
        moment()
            .startOf("day")
            .subtract(25, "hours")
    ).valueOf();
};

// Get a list of all users by their IDs
module.exports.getUserList = async (admin, nextPageToken) => {
    let userList = [];

    await admin
        .auth()
        .listUsers(1000, nextPageToken)
        .then(listUsersResult => {
            listUsersResult.users.forEach(userRecord => {
                userList.push(userRecord.uid);
            });
            return null;
        })
        .catch(err => {
            console.error(err);
        });

    return userList;
};

// Copies given todo from yesterday to today and
// deletes it from yesterday
module.exports.moveTodoToNextDay = (
    category,
    yesterdayStamp,
    admin,
    todoSnap,
    userId
) => {
    let todayStamp = moment(yesterdayStamp)
        .add(1, "day")
        .valueOf();
    let todoKey = todoSnap.val().key;

    // Set the todo in today
    admin
        .database()
        .ref(`todos`)
        .child(`${userId}/${todayStamp}/categories/${category}`)
        .update({ [todoKey]: todoSnap.val() })
        .catch(err => {
            console.error(err);
        });

    // Remove todo from yesterday
    admin
        .database()
        .ref(`todos`)
        .child(`${userId}/${yesterdayStamp}/categories/${category}/${todoKey}`)
        .remove();
};

// Iterate trough all todos from yesterday and move them to today
// If they are not repeating or not checked
module.exports.handleTodoMove = (admin, yesterdayStamp, userList) => {
    userList.forEach(async userId => {
        await admin
            .database()
            .ref(`todos`)
            .child(`${userId}/${yesterdayStamp}/categories/`)
            .once("value", categories => {
                categories.forEach(category => {
                    category.forEach(todo => {
                        if (!todo.val().isRepeating && !todo.val().isChecked) {
                            this.moveTodoToNextDay(
                                category.key,
                                yesterdayStamp,
                                admin,
                                todo,
                                userId
                            );
                        }
                    });
                });
            });
    });
};
