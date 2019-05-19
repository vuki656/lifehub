import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyD8msbJoAv3ARkzaAd3OfskJsyUogsaCdY",
    authDomain: "lifehub365.firebaseapp.com",
    databaseURL: "https://lifehub365.firebaseio.com",
    projectId: "lifehub365",
    storageBucket: "lifehub365.appspot.com",
    messagingSenderId: "238134375190",
    appId: "1:238134375190:web:b27c0d72dc8df709"
};

firebase.initializeApp(config);

export default firebase;
