import React from "react";

import { Grid } from "semantic-ui-react";

import TodoCard from "./TodoCard";

class TaskArea extends React.Component {
    state = {};

    render() {
        return (
            <Grid>
                <Grid.Row columns={"equal"}>
                    <Grid.Column>
                        <p>Morning</p>
                        <TodoCard />
                    </Grid.Column>
                    <Grid.Column>
                        <p>Day</p>
                        <TodoCard />
                    </Grid.Column>
                    <Grid.Column>
                        <p>Evening</p>
                        <TodoCard />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={"equal"}>
                    <Grid.Column>
                        <p>Work</p>
                        <TodoCard />
                    </Grid.Column>
                    <Grid.Column>
                        <p>Misc</p>
                        <TodoCard />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default TaskArea;
