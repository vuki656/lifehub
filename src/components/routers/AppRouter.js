// Object Imports
import React from "react";
import { createBrowserHistory } from "history";
import { Route, Router } from "react-router-dom";
// Component Imports
import App from "../App";
import Login from "../Login";
import Register from "../Register";

export const history = createBrowserHistory();

const AppRouter = () => (
    <Router history={history}>
        <Route path="/dashboard" exact component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
    </Router>
);

export default AppRouter;
