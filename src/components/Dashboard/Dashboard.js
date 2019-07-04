import React from "react";

import { Grid, Header } from "semantic-ui-react";

import QuoteBar from "./QuoteBar";
import TodosForDay from "./TodosForDay/TodosForDay";
import TotalTodosForToday from "./TodosForDay/TotalTodosForDay";

class Dashboard extends React.Component {
    state = {};

    render() {
        return (
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
    }
}

export default Dashboard;
