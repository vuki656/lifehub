// Object Imports
import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase/Auth";
import store from "./redux/store";
import AppRouter, { history } from "./routers/AppRouter";

// Destructured Imports
import { Provider } from "react-redux";

// Component Imports
import LoadingPage from "./components/Misc/LoadingPage";

// Styles Imports
import "react-datepicker/dist/react-datepicker.css";
import "semantic-ui-css/semantic.min.css";
import "./styles/styles.scss";

// Displays the component after redirect finishes
const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <AppRouter />
        </Provider>,
        document.getElementById("root")
    );
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
