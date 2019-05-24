import React from "react";

import { withRouter } from "react-router-dom";

import SideMenu from "./Menu/SideMenu";
import TopMenu from "./Menu/TopMenu";

function App() {
    return (
        <div className="App">
            <TopMenu />
            <SideMenu />
        </div>
    );
}

export default withRouter(App);
