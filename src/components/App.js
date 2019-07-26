// Object Imports
import React from "react";

// Destructured Imports
import { withRouter } from "react-router-dom";

// Component Imports
import SideMenu from "./SideMenu";

const App = () => {
    return (
        <div className="App">
            <SideMenu />
        </div>
    );
};

export default withRouter(App);
