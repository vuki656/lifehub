import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase/Auth";

import AppRouter, { history } from "./routers/AppRouter";

import "semantic-ui-css/semantic.min.css";
import "./styles/styles.scss";

import LoadingPage from "./components/Misc/LoadingPage";

// Displays the component after redirect finishes
const renderApp = () => {
    ReactDOM.render(<AppRouter />, document.getElementById("root"));
};

// If there is user, redirect to dashboard, else, redirect to login
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        history.push("/dashboard");
        renderApp();
    } else {
        history.push("/login");
        renderApp();
    }
});

ReactDOM.render(<LoadingPage />, document.getElementById("root"));
