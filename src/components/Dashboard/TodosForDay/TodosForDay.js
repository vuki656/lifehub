import React from "react";

import { Grid } from "semantic-ui-react";

import TodosForDayCard from "./TodosForDayCard";

class TodosForDay extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Grid.Column width={3}>
                    <TodosForDayCard category={"work"} iconName={"briefcase"} />
                </Grid.Column>
                <Grid.Column width={3}>
                    <TodosForDayCard category={"misc"} iconName={"boxes"} />
                </Grid.Column>
                <Grid.Column width={3}>
                    <TodosForDayCard category={"morning"} iconName={"coffee"} />
                </Grid.Column>
                <Grid.Column width={3}>
                    <TodosForDayCard category={"day"} iconName={"sun"} />
                </Grid.Column>
                <Grid.Column width={3}>
                    <TodosForDayCard category={"evening"} iconName={"moon"} />
                </Grid.Column>
            </React.Fragment>
        );
    }
}

export default TodosForDay;
