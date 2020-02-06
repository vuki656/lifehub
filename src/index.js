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

// Displays the component after redirect finishes
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

ReactDOM.render(<LoadingPage />, document.getElementById("root"));
