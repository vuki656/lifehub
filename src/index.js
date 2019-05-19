import React from "react";
import ReactDOM from "react-dom";

import { Route, BrowserRouter as Router } from "react-router-dom";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import App from "./components/App";

const Routing = (
    <Router>
        <div>
            <Route path="/" exact component={App} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
        </div>
    </Router>
);

ReactDOM.render(Routing, document.getElementById("root"));
