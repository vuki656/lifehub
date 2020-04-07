// Other Imports
import React from "react";
import { Route } from "react-router-dom";
// Component Imports
import Dashboard from "../../Dashboard";
import Planner from "../../Planner";
import Settings from "../../Settings";

const PrivateRouter = () => (
    <div className="main">
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/planner" component={Planner} />
        <Route path="/settings" component={Settings} />
    </div>
);

export default PrivateRouter;
