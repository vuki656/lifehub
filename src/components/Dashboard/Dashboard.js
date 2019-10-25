// Object Imports
import React from "react";
import moment from "moment";

// Destructured Imports
import { Grid } from "semantic-ui-react";

// Component Imports
import QuoteBar from "./QuoteBar";
import TodosForDay from "./TodosForDay/TodosForDay";
import TodosForDayCount from "../Global/TodosForDayCount";
import DashboardNotes from "./DashboardNotes/DashboardNotesList";
import AddDashboardNote from "./DashboardNotes/AddDashboardNote";

// Helper Imports
import { getDayOnlyTimestamp } from "../../helpers/Global";

const Dashboard = () => (
    <Grid>
        <Grid.Row className="quote-section">
            <QuoteBar />
        </Grid.Row>
        <Grid.Row className="main-section">
            <Grid.Column width={8}>
                <AddDashboardNote />
                <DashboardNotes />
            </Grid.Column>
            <Grid.Column width={8}>
                <p className="title">
                    Todos for today:{" "}
                    <TodosForDayCount day={getDayOnlyTimestamp(moment())} />
                </p>
                <TodosForDay />
            </Grid.Column>
        </Grid.Row>
    </Grid>
);

export default Dashboard;
