// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

// Update todo count every time theres an add, delete, update
exports.countTodos = functions.database
    .ref("/todos/{userId}/{day}/")
    .onWrite(async (snap, context) => {
        const todoRef = snap.after.ref;

        const morningRef = todoRef.child("morning");
        const dayRef = todoRef.child("day");
        const eveningRef = todoRef.child("evening");
        const workRef = todoRef.child("work");
        const miscRef = todoRef.child("misc");

        const morningData = await morningRef.once("value");
        const dayData = await dayRef.once("value");
        const eveningData = await eveningRef.once("value");
        const workData = await workRef.once("value");
        const miscData = await miscRef.once("value");

        let morningNum = morningData.numChildren();
        let dayNum = dayData.numChildren();
        let eveningNum = eveningData.numChildren();
        let workNum = workData.numChildren();
        let miscNum = miscData.numChildren();

        let total = morningNum + dayNum + eveningNum + workNum + miscNum;

        let dataObject = {
            count: {
                total: total,
                categories: {
                    morning: morningNum,
                    day: dayNum,
                    evening: eveningNum,
                    work: workNum,
                    misc: miscNum
                }
            }
        };

        return await todoRef.update(dataObject);
    });
