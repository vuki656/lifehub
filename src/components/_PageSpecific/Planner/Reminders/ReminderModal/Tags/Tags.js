// Object Imports
import React from "react";

// Component Imports
import AddTagSection from "./AddTagSection/AddTagSection";
import TagsList from "./TagsList/TagsList";

const Tags = props => (
    <React.Fragment>
        <TagsList reminder={props.reminder} />
        <AddTagSection />
    </React.Fragment>
);

export default Tags;
