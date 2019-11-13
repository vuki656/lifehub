// Main Imports
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const moment = require("moment");

// Helper Imports
const countHelpers = require("./helpers/CountTodos");
const cron = require("./helpers/TodoCRON");

admin.initializeApp();

// Update todo count every time theres an add, delete, update
exports.countTodos = functions.database
    .ref("/todos/{userId}/{day}/categories/")
    .onWrite(async (snap, context) => {
        const todoRef = snap.after.ref;
        let dataObject = await countHelpers.getDataFromSnap(todoRef);
        return await todoRef.parent.update({ count: dataObject });
    });

// On 00:01 today move all unfinished todos from yesterday to today
exports.pushTodosToNextDayCRON = functions.pubsub
    .schedule("1 00 * * *")
    .onRun(async context => {
        console.log("RAN AT: " + moment().format("dd/MM/YYYY ss:mm"));
        let yesterdayStamp = await cron.getYesterdayStamp();
        console.log("TCL: yesterdayStamp", yesterdayStamp);
        let userList = await cron.getUserList(admin);
        await cron.handleTodoMove(admin, yesterdayStamp, userList);
    });
