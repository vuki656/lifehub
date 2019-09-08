import * as firebase from "firebase";

var devConfig = {
    apiKey: "AIzaSyD8msbJoAv3ARkzaAd3OfskJsyUogsaCdY",
    authDomain: "lifehub365.firebaseapp.com",
    databaseURL: "https://lifehub365.firebaseio.com",
    projectId: "lifehub365",
    storageBucket: "lifehub365.appspot.com",
    messagingSenderId: "238134375190",
    appId: "1:238134375190:web:b27c0d72dc8df709"
};

const prodConfig = {
    apiKey: "AIzaSyDRKti1aV0ySu9EznEu8hxlLA1yFsHJ96A",
    authDomain: "lifehub-prod-bf96a.firebaseapp.com",
    databaseURL: "https://lifehub-prod-bf96a.firebaseio.com",
    projectId: "lifehub-prod-bf96a",
    storageBucket: "",
    messagingSenderId: "324301097274",
    appId: "1:324301097274:web:91b7abda76aeff88ff2803"
};

firebase.initializeApp(devConfig);

export default firebase;
