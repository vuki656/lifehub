// Other Imports
import React from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
// Component Imports
import PrivateRoutes from "./routers/PrivateRoutes";
import SideMenu from "./SideMenu/SideMenu";

const App = () => {
    return (
        <div className="app">
            <Router>
                <div className="app--sidemenu">
                    <SideMenu />
                </div>
                <div className="app--main">
                    <PrivateRoutes />
                </div>
            </Router>
        </div>
    )
};

export default withRouter(App);
