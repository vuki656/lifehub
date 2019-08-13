// Object Imports
import React from "react";

// Component Imports
import AddTagSection from "./AddTagSection/AddTagSection";
import TagsList from "./TagsList";

class TagOptions extends React.Component {
    render() {
        return (
            <React.Fragment>
                <TagsList reminder={this.props.reminder} />
                <AddTagSection />
            </React.Fragment>
        );
    }
}

export default TagOptions;
