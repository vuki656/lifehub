// Object Imports
import React from "react";

// Destructured Imports
import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";

// Component Imports
import App from "../components/App";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";

export const history = createBrowserHistory();

const AppRouter = () => (
    <Router history={history}>
        <Route path="/dashboard" exact component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
    </Router>
);

export default AppRouter;
