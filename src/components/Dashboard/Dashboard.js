// Object Imports
import React from "react";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import QuoteBar from "./QuoteBar";
import TodosForDay from "./TodosForDay/TodosForDay";
import TodosForDayList from "./TodosForDay/TodosForDayList";
import DashboardNotes from "./DashboardNotes/DashboardNotesList";
import AddDashboardNote from "./DashboardNotes/AddDashboardNote";

const Dashboard = () => (
    <Grid>
        <Grid.Row>
            <QuoteBar />
        </Grid.Row>
        <Grid.Row>
            <Grid.Column width={8}>
                <AddDashboardNote />
                <DashboardNotes />
            </Grid.Column>
            <Grid.Column width={8}>
                <p className="subtitle">
                    Todos for today: <TodosForDayList />
                </p>
                <TodosForDay />
            </Grid.Column>
        </Grid.Row>
    </Grid>
);

export default Dashboard;
