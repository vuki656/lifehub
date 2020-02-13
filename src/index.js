// Other Imports
import React from "react";
import ReactDOM from "react-dom";
import firebase from "./helpers/firebase/Auth";
import store from "./helpers/redux/store";
import AppRouter, { history } from "./components/_Generic/Routers/AppRouter";
import { Provider } from "react-redux";
// Component Imports
import { Transition } from "./components/_Generic/Transitions/Transition";
// Styles Imports
import { StylesProvider } from '@material-ui/core/styles';
import "react-datepicker/dist/react-datepicker.css";
import "./styles/css/styles.scss";

// If there is user, redirect to dashboard, else, redirect to login
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        history.push("/dashboard");
    } else {
        history.push("/login");
    }
    renderApp();
});

// Displays the root component
const renderApp = () => {
    ReactDOM.render(
        <StylesProvider injectFirst>
            <Provider store={store}>
                <AppRouter />
            </Provider>
        </StylesProvider>,
        document.getElementById("root")
    );
};

// Display loading page before anything else is done
ReactDOM.render(<Transition />, document.getElementById("root"));
