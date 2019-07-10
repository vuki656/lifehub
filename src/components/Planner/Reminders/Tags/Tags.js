// Object Imports
import React from "react";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import AddTagSection from "./AddTagSection";
import TagsList from "./TagsList";

class TagOptions extends React.Component {
    render() {
        return (
            <Grid>
                <Grid.Row columns={"equal"}>
                    <Grid.Column>
                        <TagsList reminder={this.props.reminder} />
                    </Grid.Column>
                    <Grid.Column>
                        <AddTagSection />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default TagOptions;
