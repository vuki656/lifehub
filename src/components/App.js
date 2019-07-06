// Object Imports
import React from "react";

// Destructured Imports
import { withRouter } from "react-router-dom";

// Component Imports
import Menu from "./Menu/Menu";

const App = () => {
    return (
        <div className="App">
            <Menu />
        </div>
    );
};

export default withRouter(App);
