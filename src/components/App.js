import React from "react";

import { withRouter } from "react-router-dom";

import Menu from "./Menu/Menu";

const App = () => {
    return (
        <div className="App">
            <Menu />
        </div>
    );
};

export default withRouter(App);
