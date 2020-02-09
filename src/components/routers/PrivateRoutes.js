// Object Imports
import React from "react";
// Destructured Imports
import { Route } from "react-router-dom";
// Component Imports
import Dashboard from "../Dashboard/Dashboard";
import Planner from "../Planner/Planner";
import Journal from "../Journal/Journal";
import Weight from "../Weight/Weight";
import Settings from "../Settings/Settings";

const PrivateRouter = () => (
    <div className="app--main">
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/planner" component={Planner} />
        <Route path="/journal" component={Journal} />
        <Route path="/weight" component={Weight} />
        <Route path="/settings" component={Settings} />
    </div>
);

export default PrivateRouter;
