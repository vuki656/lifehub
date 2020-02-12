// Other Imports
import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase/Auth";
import store from "./redux/store";
import AppRouter, { history } from "./components/routers/AppRouter";
import { Provider } from "react-redux";
// Component Imports
import { Transition } from "./components/Misc/Transition";
// Styles Imports
import { StylesProvider } from '@material-ui/core/styles';
import "react-datepicker/dist/react-datepicker.css";
import "./styles/styles.scss";

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
