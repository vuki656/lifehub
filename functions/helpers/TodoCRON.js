const moment = require("moment");

// Get day before timestamp
// Sub 18 is used because there is a time
// difference on google server and it returns
// wrong value
module.exports.getYesterdayStamp = async () => {
    return moment(moment().startOf("day"))
        .subtract(18, "hours")
        .valueOf();
};

// Get a list of all users by their ids
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
        .then()
        .catch(err => {
            console.error(err);
        });

    return userList;
};

// Moves given todo from yesterday to today and
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

    // Put to see when exatly its running by local time not server time
    console.log("stamp whenn CRON ran: " + yesterdayStamp);

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

// Itterate trough all todos from yesterday and move them to today
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
