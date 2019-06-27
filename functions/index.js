// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

const countHelpers = require("./helpers/CountTodos");
const cron = require("./helpers/TodoCRON");

// Update todo count every time theres an add, delete, update
exports.countTodos = functions.database
    .ref("/todos/{userId}/{day}/categories/")
    .onWrite(async (snap, context) => {
        const todoRef = snap.after.ref;
        let dataObject = await countHelpers.getDataFromSnap(todoRef);
        return await todoRef.parent.update(dataObject);
    });

// On 00:01 today move all move all unfinished
// todos from yesterday to today
exports.pushTodosToNextDayCRON = functions.pubsub
    .schedule("1 00 * * *")
    .onRun(async context => {
        let yesterdayStamp = await cron.getYesterdayStamp();
        let userList = await cron.getUserList(admin);
        await cron.handleTodoMove(admin, yesterdayStamp, userList);
    });
