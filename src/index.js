import React from "react";
import ReactDOM from "react-dom";
import firebase from "./firebase/Auth";

import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";

import "semantic-ui-css/semantic.min.css";
import "./styles/styles.scss";

import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

export const history = createBrowserHistory();

class AppRouter extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                history.push("/dashboard");
            } else {
                history.push("/login");
            }
        });
    }

    render() {
        return (
            <Router history={history}>
                <Route path="/dashboard" exact component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Router>
        );
    }
}

ReactDOM.render(<AppRouter />, document.getElementById("root"));
