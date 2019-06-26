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

module.exports.listAllUsers = async (admin, nextPageToken) => {
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
            console.log("Error printing users: " + err);
        });

    return userList;
};

module.exports.print = (admin, stamp, userList) => {
    userList.forEach(async userId => {
        await console.log("from user: " + userId);
        await admin
            .database()
            .ref(`todos`)
            .child(`${userId}/${stamp}/categories/`)
            .on("value", categories => {
                categories.forEach(category => {
                    console.log("category key: " + category.key);
                    category.forEach(todo => {
                        key = todo.val().key;
                        value = todo.val().value;
                        console.log("key: " + key + " " + value);
                    });
                });
            });
    });
};
