// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

const helpers = require("./helpers");

// Update todo count every time theres an add, delete, update
exports.countTodos = functions.database
    .ref("/todos/{userId}/{day}/")
    .onWrite(async (snap, context) => {
        const todoRef = snap.after.ref;
        let dataObject = await helpers.getDataFromSnap(todoRef);
        return await todoRef.update(dataObject);
    });
