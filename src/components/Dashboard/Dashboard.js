// Object Imports
import React from "react";

// Destructured Imports
import { Grid, Header } from "semantic-ui-react";

// Component Imports
import QuoteBar from "./QuoteBar";
import TodosForDay from "./TodosForDay/TodosForDay";
import TotalTodosForToday from "./TodosForDay/TotalTodosForDay";

const Dashboard = () => (
    <Grid>
        <Grid.Row>
            <QuoteBar />
        </Grid.Row>
        <Grid.Row>
            <Header>
                Todos for today: <TotalTodosForToday />
            </Header>
        </Grid.Row>
        <Grid.Row>
            <TodosForDay />
        </Grid.Row>
    </Grid>
);

export default Dashboard;
