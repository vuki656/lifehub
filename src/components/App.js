// Other Imports
import React from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
// Component Imports
import PrivateRoutes from "./_Generic/Routers/PrivateRoutes";
import SideMenu from "./_PageSpecific/SideMenu/SideMenu";

const App = () => {
    return (
        <div className="app">
            <Router>
                <SideMenu />
                <PrivateRoutes />
            </Router>
        </div>
    )
};

export default withRouter(App);
