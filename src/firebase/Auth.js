import * as firebase from "firebase";

// eslint-disable-next-line
var devConfig = {
    apiKey: "AIzaSyD8msbJoAv3ARkzaAd3OfskJsyUogsaCdY",
    authDomain: "lifehub365.firebaseapp.com",
    databaseURL: "https://lifehub365.firebaseio.com",
    projectId: "lifehub365",
    storageBucket: "lifehub365.appspot.com",
    messagingSenderId: "238134375190",
    appId: "1:238134375190:web:b27c0d72dc8df709"
};

// eslint-disable-next-line
var prodConfig = {
    apiKey: "AIzaSyC19AXyKeFuISG_JP0CsM7GwT2qaAYyW1M",
    authDomain: "lifehub-prod.firebaseapp.com",
    databaseURL: "https://lifehub-prod.firebaseio.com",
    projectId: "lifehub-prod",
    storageBucket: "",
    messagingSenderId: "1076197291752",
    appId: "1:1076197291752:web:ed4570dee199b76e"
};

firebase.initializeApp(prodConfig);

export default firebase;
