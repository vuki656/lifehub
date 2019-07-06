// Object Imports
import React from "react";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import TodosForDayCard from "./TodosForDayCard";

const TodosForDay = () => (
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

export default TodosForDay;
