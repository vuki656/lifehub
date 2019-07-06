// Object Imports
import React from "react";

// Destructured Imports
import { Loader, Dimmer } from "semantic-ui-react";

const LoadingPage = () => (
    <Dimmer active>
        <Loader size="huge" content={"Loading..."} />
    </Dimmer>
);

export default LoadingPage;
