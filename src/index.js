// Other Imports
import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase/Auth";
import store from "./redux/store";
import AppRouter, { history } from "./routers/AppRouter";
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
ReactDOM.render(<LoadingPage />, document.getElementById("root"));
