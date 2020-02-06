// Other Imports
import React from "react";
import { withRouter } from "react-router-dom";
// Component Imports
import SideMenu from "./SideMenu/SideMenu";

const App = () => {
    return (
        <div className="App">
            <SideMenu />
        </div>
    );
};

export default withRouter(App);
