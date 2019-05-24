import React from "react";

import { Route } from "react-router-dom";

import Dashboard from "../components/Dashboard/Dashboard";
import Planner from "../components/Planner/Planner";
import Journal from "../components/Journal/Journal";
import Weight from "../components/Weight/Weight";
import Settings from "../components/Settings/Settings";

const PrivateRouter = () => (
    <React.Fragment>
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/planner" component={Planner} />
        <Route path="/journal" component={Journal} />
        <Route path="/weight" component={Weight} />
        <Route path="/settings" component={Settings} />
    </React.Fragment>
);

export default PrivateRouter;
